# 🎈 Aniya's Adventure Diary

> "Growing Up Is An Adventure"

A beautiful, modern digital diary designed to capture the giggles, milestones, and messy moments of childhood. Built as a high-performance Single Page Application (SPA) with a focus on immersive storytelling.

![Project Preview](/public/project-preview.png)

## ✨ Features

- **Immersive "No-Nav" Design**: A seamless scrolling experience that flows from Hero to Highlights, Gallery, and Timeline.
- **Dynamic Timeline**: Visually track growth year by year, manageable directly from the admin panel.
- **Local File Uploads**: Drag & drop multiple photos directly into the diary. Images are stored locally—no cloud setup required!
- **Secret Diary (Admin)**: A password-protected dashboard (`/admin`) to add day-to-day adventures and major milestones.
- **Author Tags**: Attribute memories to Mom, Dad, Grandparents, or Aniya herself.
- **Data Persistence**: Simple, portable JSON-based backend. Easy to backup and move.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Ashfatul/adventure_of_aniya.git
    cd adventure_of_aniya
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open the diary**
    Visit [http://localhost:3000](http://localhost:3000) to see the site.

## 🔐 Admin Access

To add new memories or milestones:

1.  Go to [http://localhost:3000/admin](http://localhost:3000/admin).
2.  Enter the secret code: **`aniya123`**.
3.  Start documenting!

## 📂 Project Structure

- `data/`: JSON files storing your memories and timeline events.
- `public/uploads/`: Where your uploaded photos live.
- `src/components/`: Modular UI components (Hero, Gallery, Timeline).
- `src/app/page.js`: The main single-page assembly.

---

*Made with ❤️ for Aniya*
