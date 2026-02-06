"""
Hadi Database Manager
Stores client requests and chat history for training and security
"""

import sqlite3
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, List
import pandas as pd


class HadiDatabase:
    """Manages client data and chat history storage."""

    def __init__(self, db_path: str = "hadi_data.db"):
        """Initialize database connection and create tables if needed."""
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row  # Enable column access by name
        self.create_tables()

    def create_tables(self):
        """Create database tables for client requests and chat history."""
        cursor = self.conn.cursor()

        # Table 1: Client Requests (Email, Name, Project Info)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS client_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                email TEXT,
                name TEXT,
                phone TEXT,
                company TEXT,
                project_type TEXT,
                project_description TEXT,
                budget_range TEXT,
                timeline TEXT,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ip_address TEXT,
                user_agent TEXT,
                language TEXT,
                status TEXT DEFAULT 'new'
            )
        """)

        # Table 2: Chat History (Full Conversation Logs)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                message_role TEXT NOT NULL,
                message_content TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                email TEXT,
                language TEXT,
                metadata TEXT
            )
        """)

        # Table 3: Sessions (Track all sessions)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                email TEXT,
                message_count INTEGER DEFAULT 0,
                request_submitted BOOLEAN DEFAULT 0
            )
        """)

        self.conn.commit()

    # ========================================================================
    # Client Requests
    # ========================================================================

    def save_client_request(
        self,
        session_id: str,
        email: Optional[str] = None,
        name: Optional[str] = None,
        phone: Optional[str] = None,
        company: Optional[str] = None,
        project_type: Optional[str] = None,
        project_description: Optional[str] = None,
        budget_range: Optional[str] = None,
        timeline: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        language: Optional[str] = None,
    ) -> int:
        """Save a client request to the database."""
        cursor = self.conn.cursor()

        cursor.execute("""
            INSERT INTO client_requests (
                session_id, email, name, phone, company,
                project_type, project_description, budget_range,
                timeline, ip_address, user_agent, language
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            session_id, email, name, phone, company,
            project_type, project_description, budget_range,
            timeline, ip_address, user_agent, language
        ))

        self.conn.commit()
        return cursor.lastrowid

    def update_client_request_status(self, request_id: int, status: str):
        """Update the status of a client request."""
        cursor = self.conn.cursor()
        cursor.execute(
            "UPDATE client_requests SET status = ? WHERE id = ?",
            (status, request_id)
        )
        self.conn.commit()

    def get_all_requests(self) -> List[Dict]:
        """Get all client requests."""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT * FROM client_requests
            ORDER BY submitted_at DESC
        """)
        return [dict(row) for row in cursor.fetchall()]

    def get_pending_requests(self) -> List[Dict]:
        """Get all pending client requests."""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT * FROM client_requests
            WHERE status = 'new'
            ORDER BY submitted_at DESC
        """)
        return [dict(row) for row in cursor.fetchall()]

    # ========================================================================
    # Chat History
    # ========================================================================

    def save_chat_message(
        self,
        session_id: str,
        role: str,  # 'user' or 'assistant'
        content: str,
        email: Optional[str] = None,
        language: Optional[str] = None,
        metadata: Optional[Dict] = None,
    ):
        """Save a chat message to history."""
        cursor = self.conn.cursor()

        metadata_json = json.dumps(metadata) if metadata else None

        cursor.execute("""
            INSERT INTO chat_history (
                session_id, message_role, message_content,
                email, language, metadata
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (session_id, role, content, email, language, metadata_json))

        self.conn.commit()

    def get_session_history(self, session_id: str) -> List[Dict]:
        """Get full chat history for a session."""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT * FROM chat_history
            WHERE session_id = ?
            ORDER BY timestamp ASC
        """, (session_id,))
        return [dict(row) for row in cursor.fetchall()]

    def get_all_chat_history(self, limit: Optional[int] = None) -> List[Dict]:
        """Get all chat history, optionally limited."""
        cursor = self.conn.cursor()
        query = "SELECT * FROM chat_history ORDER BY timestamp DESC"
        if limit:
            query += f" LIMIT {limit}"
        cursor.execute(query)
        return [dict(row) for row in cursor.fetchall()]

    # ========================================================================
    # Sessions
    # ========================================================================

    def create_session(self, session_id: str):
        """Create a new session record."""
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT OR IGNORE INTO sessions (session_id)
            VALUES (?)
        """, (session_id,))
        self.conn.commit()

    def update_session(
        self,
        session_id: str,
        email: Optional[str] = None,
        increment_messages: bool = False,
        request_submitted: bool = False
    ):
        """Update session information."""
        cursor = self.conn.cursor()

        updates = ["last_activity = CURRENT_TIMESTAMP"]
        params = []

        if email:
            updates.append("email = ?")
            params.append(email)

        if increment_messages:
            updates.append("message_count = message_count + 1")

        if request_submitted:
            updates.append("request_submitted = 1")

        params.append(session_id)

        query = f"UPDATE sessions SET {', '.join(updates)} WHERE session_id = ?"
        cursor.execute(query, params)
        self.conn.commit()

    def get_session_stats(self) -> Dict:
        """Get overall statistics."""
        cursor = self.conn.cursor()

        stats = {}

        # Total sessions
        cursor.execute("SELECT COUNT(*) FROM sessions")
        stats['total_sessions'] = cursor.fetchone()[0]

        # Total messages
        cursor.execute("SELECT COUNT(*) FROM chat_history")
        stats['total_messages'] = cursor.fetchone()[0]

        # Total requests
        cursor.execute("SELECT COUNT(*) FROM client_requests")
        stats['total_requests'] = cursor.fetchone()[0]

        # Pending requests
        cursor.execute("SELECT COUNT(*) FROM client_requests WHERE status = 'new'")
        stats['pending_requests'] = cursor.fetchone()[0]

        return stats

    # ========================================================================
    # Export Functions
    # ========================================================================

    def export_to_excel(self, output_file: str = "hadi_data.xlsx"):
        """Export all data to Excel with multiple sheets."""
        with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
            # Sheet 1: Client Requests
            requests_df = pd.DataFrame(self.get_all_requests())
            if not requests_df.empty:
                requests_df.to_excel(writer, sheet_name='Client Requests', index=False)

            # Sheet 2: Chat History
            history_df = pd.DataFrame(self.get_all_chat_history())
            if not history_df.empty:
                history_df.to_excel(writer, sheet_name='Chat History', index=False)

            # Sheet 3: Sessions
            cursor = self.conn.cursor()
            cursor.execute("SELECT * FROM sessions ORDER BY created_at DESC")
            sessions_df = pd.DataFrame([dict(row) for row in cursor.fetchall()])
            if not sessions_df.empty:
                sessions_df.to_excel(writer, sheet_name='Sessions', index=False)

            # Sheet 4: Statistics
            stats = self.get_session_stats()
            stats_df = pd.DataFrame([stats])
            stats_df.to_excel(writer, sheet_name='Statistics', index=False)

        return output_file

    def export_to_csv(self, output_dir: str = "exports"):
        """Export data to separate CSV files."""
        Path(output_dir).mkdir(exist_ok=True)

        # Requests
        requests_df = pd.DataFrame(self.get_all_requests())
        if not requests_df.empty:
            requests_df.to_csv(f"{output_dir}/client_requests.csv", index=False)

        # Chat History
        history_df = pd.DataFrame(self.get_all_chat_history())
        if not history_df.empty:
            history_df.to_csv(f"{output_dir}/chat_history.csv", index=False)

        return output_dir

    def close(self):
        """Close database connection."""
        self.conn.close()


# ============================================================================
# Convenience Functions
# ============================================================================

def get_database() -> HadiDatabase:
    """Get or create the Hadi database instance."""
    return HadiDatabase()


if __name__ == "__main__":
    # Test the database
    db = HadiDatabase()

    # Create test data
    db.create_session("test-session-123")
    db.save_chat_message("test-session-123", "user", "Hello, I need a mobile app")
    db.save_chat_message("test-session-123", "assistant", "Great! Tell me about your project.")
    db.save_client_request(
        session_id="test-session-123",
        email="client@example.com",
        name="Ahmed Ali",
        project_type="Mobile App",
        project_description="E-commerce mobile application"
    )

    # Export to Excel
    print("Exporting to Excel...")
    excel_file = db.export_to_excel()
    print(f"✅ Data exported to: {excel_file}")

    # Show stats
    stats = db.get_session_stats()
    print("\n📊 Statistics:")
    for key, value in stats.items():
        print(f"  {key}: {value}")

    db.close()
