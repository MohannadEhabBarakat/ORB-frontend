# ORB - Open Rad Bench

ORB - Open Rad Bench is a Next.js application designed for annotating and viewing medical imaging data. It integrates a powerful medical imaging viewer with form generation and session recording capabilities.

## Tech Stack

- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4, shadcn/ui, @base-ui/react
- **State Management**: Redux Toolkit
- **Imaging Viewer**: @niivue/niivue (for rendering neuroimaging data)
- **Form Generation**: @formio/react
- **Session Recording**: rrweb

## Getting Started

First, install the dependencies. You can use either `bun` or `npm`:

```bash
# Using bun
bun install

# Using npm
npm install
```

Then, run the development server:

```bash
# Using bun
bun run dev

# Using npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js App Router (Pages, Layouts).
- `components/`: React components, including:
  - `viewer/`: Medical imaging viewer components powered by Niivue.
  - `sidebar/`: Main menu and sidebar configurations.
  - `topbar/`: Top navigation bar.
  - `ui/`: Reusable UI components from shadcn.
- `hooks/`: Custom React hooks (e.g., `useRrwebRecorder` for session recording).
- `store/`: Redux store configuration and slices.
- `lib/`: Utility functions and library configurations.

## Key Features

- **Medical Imaging Viewing**: Seamless integration with Niivue for advanced visualization of medical imaging files.
- **Dynamic Forms**: Utilizing Form.io to render dynamic forms for complex annotations.
- **Session Recording**: Automatic recording of user interactions and state changes using rrweb.
- **Resizable Layouts**: Flexible UI panels built with `react-resizable-panels`.
