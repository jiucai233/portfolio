import os
import re
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any
from notion_client import Client
from dotenv import load_dotenv

class NotionService:
    def __init__(self):
        # Load .env from the parent directory of this script (PyBackend)
        env_path = Path(__file__).resolve().parent.parent / ".env"
        load_dotenv(dotenv_path=env_path)
        
        self.notion_token = os.getenv("NOTION_API_KEY")
        self.database_id = os.getenv("NOTION_DATABASE_ID")

        if not self.notion_token:
            raise ValueError("NOTION_API_KEY not found in environment variables.")
        if not self.database_id:
            raise ValueError("NOTION_DATABASE_ID not found in environment variables.")

        self.notion = Client(auth=self.notion_token)
        
        # Format database_id to UUID if needed (8-4-4-4-12)
        if len(self.database_id) == 32 and "-" not in self.database_id:
            self.database_id = f"{self.database_id[:8]}-{self.database_id[8:12]}-{self.database_id[12:16]}-{self.database_id[16:20]}-{self.database_id[20:]}"
        
        # Target directory: portfolio-website/app/blogs/temp
        self.output_base_dir = Path(__file__).resolve().parent.parent.parent / "portfolio-website" / "app" / "blogs" / "temp"
        self.output_base_dir.mkdir(parents=True, exist_ok=True)

    def get_database_pages(self):
        """Fetches pages from the Notion database."""
        try:
            # Reverting to SDK method after downgrade
            response = self.notion.databases.query(database_id=self.database_id)
            return response.get("results", [])
        except Exception as e:
            print(f"Error fetching Notion database pages: {e}")
            return []
        except Exception as e:
            print(f"Error fetching Notion database pages: {e}")
            return []

    def get_page_blocks(self, page_id: str) -> List[Dict[str, Any]]:
        """Fetches all blocks for a given page, handling pagination."""
        all_blocks = []
        has_more = True
        start_cursor = None

        while has_more:
            try:
                response = self.notion.blocks.children.list(
                    block_id=page_id,
                    start_cursor=start_cursor
                )
                blocks = response.get("results", [])
                all_blocks.extend(blocks)
                has_more = response.get("has_more", False)
                start_cursor = response.get("next_cursor")
            except Exception as e:
                print(f"Error fetching blocks for page {page_id}: {e}")
                has_more = False
        
        return all_blocks

    def _rich_text_to_md(self, rich_text_list: List[Dict[str, Any]]) -> str:
        """Converts a list of rich text objects to a markdown string."""
        text_content = ""
        for text in rich_text_list:
            plain_text = text.get("plain_text", "")
            annotations = text.get("annotations", {})
            href = text.get("href")

            # Apply styling
            if annotations.get("code"):
                plain_text = f"`{plain_text}`"
            if annotations.get("bold"):
                plain_text = f"**{plain_text}**"
            if annotations.get("italic"):
                plain_text = f"*{plain_text}*"
            if annotations.get("strikethrough"):
                plain_text = f"~~{plain_text}~~"
            
            # Apply link
            if href:
                plain_text = f"[{plain_text}]({href})"
            
            text_content += plain_text
        return text_content

    def _block_to_markdown(self, block: Dict[str, Any]) -> str:
        """Converts a single Notion block to Markdown."""
        b_type = block.get("type")
        content = block.get(b_type, {})
        
        # Handle recursive children (nested blocks) if necessary
        # For simplicity, we are handling direct children logic here mostly.
        # Deep nesting might require recursion, but keeping it flat-ish for now.

        md_text = ""
        
        if b_type == "paragraph":
            md_text = self._rich_text_to_md(content.get("rich_text", [])) + "\n"
        
        elif b_type in ["heading_1", "heading_2", "heading_3"]:
            level = int(b_type.split("_")[1])
            text = self._rich_text_to_md(content.get("rich_text", []))
            md_text = f"{'#' * level} {text}\n"

        elif b_type == "bulleted_list_item":
            text = self._rich_text_to_md(content.get("rich_text", []))
            md_text = f"- {text}\n"
        
        elif b_type == "numbered_list_item":
            text = self._rich_text_to_md(content.get("rich_text", []))
            md_text = f"1. {text}\n" # Markdown renders sequential numbers automatically usually
        
        elif b_type == "to_do":
            text = self._rich_text_to_md(content.get("rich_text", []))
            checked = "x" if content.get("checked") else " "
            md_text = f"- [{checked}] {text}\n"

        elif b_type == "code":
            language = content.get("language", "text")
            text = self._rich_text_to_md(content.get("rich_text", []))
            md_text = f"``` {language}\n{text}\n```\n"

        elif b_type == "image":
            # Handle external and file images
            # Note: Notion hosted files (type='file') have expiring URLs (1 hour).
            # For a static blog, you might need to download them. 
            # Here we just link them for the 'temp' usage.
            if content.get("type") == "external":
                url = content.get("external", {}).get("url")
            else:
                url = content.get("file", {}).get("url")
            
            caption_list = content.get("caption", [])
            caption = self._rich_text_to_md(caption_list) if caption_list else "image"
            md_text = f"![{caption}]({url})\n"
        
        elif b_type == "quote":
            text = self._rich_text_to_md(content.get("rich_text", []))
            md_text = f"> {text}\n"

        elif b_type == "divider":
            md_text = "---\n"
        
        elif b_type == "callout":
            text = self._rich_text_to_md(content.get("rich_text", []))
            icon_obj = content.get("icon")
            icon = icon_obj.get("emoji", "💡") if icon_obj else "💡"
            md_text = f"> {icon} {text}\n"

        # Append a newline for spacing
        return md_text + "\n"

    def extract_frontmatter(self, page: Dict[str, Any]) -> str:
        """Extracts properties and formats them as YAML Frontmatter."""
        props = page.get("properties", {})
        
        # Helper to safely get property values
        def get_prop(name, type_key, default=""):
            if name not in props: return default
            p = props[name]
            if p["type"] != type_key: return default
            
            if type_key == "title":
                return "".join([t["plain_text"] for t in p["title"]])
            elif type_key == "rich_text":
                return "".join([t["plain_text"] for t in p["rich_text"]])
            elif type_key == "date":
                return p["date"]["start"] if p["date"] else default
            elif type_key == "multi_select":
                return [opt["name"] for opt in p["multi_select"]]
            elif type_key == "select":
                return p["select"]["name"] if p["select"] else default
            elif type_key == "checkbox":
                return p["checkbox"]
            return default

        # Adjust these keys based on your actual Notion DB Column Names
        title = get_prop("Name", "title", "Untitled") # Standard is 'Name' or 'Title'
        if not title: title = get_prop("Title", "title", "Untitled")
        
        summary = get_prop("Summary", "rich_text", "")
        
        # Date parsing
        date_str = get_prop("Date", "date", datetime.now().strftime("%Y.%m.%d"))
        # Format date as YYYY.M.D if possible, otherwise keep as is
        # Existing blog used "2024.1.3", Notion returns "2024-01-03"
        try:
            d_obj = datetime.strptime(date_str, "%Y-%m-%d")
            formatted_date = f"{d_obj.year}.{d_obj.month}.{d_obj.day}"
        except:
            formatted_date = date_str

        tags = get_prop("Tags", "multi_select", [])
        
        # Assuming 'Draft' or 'Status' property exists. Defaulting to false if not found.
        # You can map Status='Published' to draft=false
        status = get_prop("Status", "status") # or 'select'
        is_draft = "false" # Default to published for now unless specified
        if status and status.lower() not in ["done", "published", "complete"]:
            is_draft = "true"

        # Build Frontmatter
        fm = "---\n"
        fm += f'title: "{title}"\n'
        fm += f'summary: "{summary}"\n'
        fm += f'date: "{formatted_date}"\n'
        fm += f'draft: {is_draft}\n'
        if tags:
            fm += "tags:\n"
            for tag in tags:
                fm += f"- {tag}\n"
        else:
            fm += "tags: []\n"
        fm += "---\n"
        
        return fm, title

    def sync_pages(self):
        """Main execution flow."""
        print(f"Checking for pages in database: {self.database_id}")
        pages = self.get_database_pages()
        print(f"Found {len(pages)} pages.")

        for page in pages:
            # 1. Extract Metadata
            frontmatter, title = self.extract_frontmatter(page)
            
            # Sanitize title for folder name
            safe_title = re.sub(r'[\\/*?:"<>|]', "", title).strip().replace(" ", "_")
            if not safe_title:
                print("Skipping page with empty title")
                continue

            # 2. Prepare Output Directory
            page_dir = self.output_base_dir / safe_title
            page_dir.mkdir(parents=True, exist_ok=True)
            output_file = page_dir / "index.md"
            
            # 3. Fetch Content & Convert
            print(f"Processing: {title} -> {output_file}")
            blocks = self.get_page_blocks(page["id"])
            
            markdown_content = frontmatter + "\n"
            for block in blocks:
                markdown_content += self._block_to_markdown(block)
            
            # 4. Write File
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(markdown_content)
            
        print("Sync complete.")

if __name__ == "__main__":
    service = NotionService()
    service.sync_pages()
