# Matchboxd 🎬

**Matchboxd** enhances your movie selection experience by helping you find the perfect film to watch today! By comparing watchlists or film lists from Letterboxd users, Matchboxd identifies common movies to make your movie night planning seamless and fun.

## ✨ Features

### Let's Match!
- **Match Functionality**: Compare watchlists or film lists from multiple Letterboxd users and discover the intersection of films they all want to watch. Perfect for group movie nights!

![Matchboxd Screenshot](https://github.com/yoarajota/matchboxd/assets/81939995/21403988-d07c-4314-8ec4-bbff64219069)

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (v13.4.12)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (v5.1.6)
- **Frontend**: [React](https://reactjs.org/) (v18.2.0), [React DOM](https://reactjs.org/) (v18.2.0)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (v10.13.1)
- **HTTP Requests**: [Axios](https://axios-http.com/) (v1.4.0)
- **Web Scraping**: [JSDOM](https://github.com/jsdom/jsdom) (v22.1.0)
- **Utilities**: [Lodash](https://lodash.com/) (v4.17.21)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/) (v9.1.3)
- **Linting**: [ESLint](https://eslint.org/) (v8.45.0) with [eslint-config-next](https://nextjs.org/docs/basic-features/eslint) (v13.4.12)
- **Type Definitions**: TypeScript types for Node, React, React DOM, JSDOM, and Lodash

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yoarajota/matchboxd.git
   cd matchboxd
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

4. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

5. **Lint the codebase**:
   ```bash
   npm run lint
   ```

## 🚀 Usage

Matchboxd fetches data from Letterboxd to compare user watchlists or film lists. The core functionality is implemented in the `getFromLetterboxd` function, which scrapes movie data from Letterboxd profiles using [JSDOM](https://github.com/jsdom/jsdom) and [Axios](https://axios-http.com/).

### Example Code
Below is the primary function for fetching Letterboxd data:

```typescript
import { Films, Film, Scope, WatchList } from "@/types";
import axios from "axios";
import { DOMWindow, JSDOM } from "jsdom";

type Resolve = { index: number; sectionResult: Array<string> };

async function getFromLetterboxd(
  resolve: (e: Films | WatchList) => void,
  reject: (e: string) => void,
  username: string,
  scope: Scope
) {
  const list = new Set<string>();
  let otherC = 1;
  let amountRequests = 5;
  let storeWindowFirstReq: DOMWindow;

  try {
    // Initial request to determine pagination
    const response = await axios.get(`https://letterboxd.com/${username}/${scope}/page/1`);
    const { window } = new JSDOM(response.data);
    storeWindowFirstReq = window;

    const paginate = window.document.getElementsByClassName("paginate-page");
    amountRequests = paginate.length
      ? parseInt(paginate[paginate.length - 1]?.textContent ?? "5")
      : window.document.querySelectorAll(".really-lazy-load.poster.film-poster").length
      ? 1
      : 0;

    if (!amountRequests && scope === "films") {
      resolve({ [scope]: [], username } as Films);
      return;
    } else if (!amountRequests) {
      resolve({ [scope]: [], username } as WatchList);
      return;
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      reject(`${username} is not a valid Letterboxd username!`);
    }
    return;
  }

  // Fetch additional pages
  const arrPromises: Array<Promise<Resolve>> = [];
  const holdaOldOtherC = otherC;

  while (otherC !== holdaOldOtherC + amountRequests) {
    const curr = otherC;
    arrPromises.push(
      new Promise(async (res, rej) => {
        if (curr === 1) {
          retrieveData(storeWindowFirstReq, res, curr);
          return;
        }

        try {
          const response = await axios.get(`https://letterboxd.com/${username}/${scope}/page/${curr}`);
          const { window } = new JSDOM(response.data);
          retrieveData(window, res, curr);
        } catch (error: any) {
          if (error.response?.status === 404) {
            rej(`${username} is not a valid Letterboxd username!`);
          }
        }
      })
    );
    otherC++;
  }

  // Process responses
  const responses = await Promise.all(arrPromises);
  const sortedArray = responses.sort((a, b) => a.index - b.index);

  for (const response of sortedArray) {
    for (const decoded of response.sectionResult) {
      list.add(decoded);
    }
  }

  const result = {
    [scope]: Array.from(list).map((string): Film => JSON.parse(string)),
    username,
  };

  resolve(result as Films | WatchList);
}

function retrieveData(window: DOMWindow, res: (a: Resolve) => void, curr: number) {
  const parentDivs = window.document.querySelectorAll(".really-lazy-load.poster.film-poster");
  const sectionResult: string[] = [];

  for (const div of parentDivs) {
    const obj: Film = { slug: "", alt: "" };

    for (const { localName, textContent } of div.attributes) {
      if (localName === "data-film-slug" && textContent) {
        obj.slug = textContent;
        break;
      }
    }

    for (const { localName, textContent } of div.children[0].attributes) {
      if (localName === "alt" && textContent) {
        obj.alt = textContent;
        break;
      }
    }

    sectionResult.push(JSON.stringify(obj));
  }

  res({ index: curr, sectionResult });
}

export { getFromLetterboxd };
```

This function:
1. Fetches a user's watchlist or film list from Letterboxd.
2. Handles pagination by determining the number of pages to scrape.
3. Uses JSDOM to parse HTML and extract film data (e.g., film slugs and titles).
4. Returns a structured list of films for further processing.

## 📝 Contributing

We welcome contributions! To get started:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure your code follows the project's ESLint rules (`npm run lint`).

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
