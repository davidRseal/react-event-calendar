# REACT-EVENT-CALENDAR Storybook app

# (live demo: https://davidrseal.github.io/react-event-calendar)

This project was generated using the Storybook guide here <https://storybook.js.org/tutorials/intro-to-storybook/react/en/get-started/>

My contribution is the Calendar componenent at `src/stories/Calendar.jsx` which is an interactive calendar component for scheduling and viewing "events." It's meant to be integrated into React apps.

Code examples are at `src/stories/Calendar.stories.jsx` and there's an interactive demo within Storybook if you run the app.
The Storybook is statically hosted at https://davidrseal.github.io/react-event-calendar through GitHub Pages.

## Quick start

1. **Install the dependencies.**

```shell
# Clone the project and navigate to the directory
cd react-event-calendar/

# Install the dependencies
npm install
```

2. **Browse the stories**

Run `npm run storybook` and navigate to `http://localhost:6006`

## 🔎 What's inside?

A quick look at the top-level files and directories included with this template.

```
.
├── .storybook
├── node_modules
├── public
├── src
├── .gitignore
├── LICENSE
├── package.json
├── yarn.lock
└── README.md
```

1. **`.storybook`**: This directory contains Storybook's [configuration](https://storybook.js.org/docs/react/configure/overview) files.

2. **`src`**: This directory will contain all of the code related to what you will see in the application.

PS fix Prettier code-style errors with `npx prettier -w .`
