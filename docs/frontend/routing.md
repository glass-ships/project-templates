# Links and routing

The app uses [React Router](https://reactrouter.com/). Routes are in `src/main.tsx`, inside a layout route that renders the navbar and [`ScrollToHash`](api/components/RouterLink.md) on every page.

## Links

[`AppButton`](api/components/ui/AppButton.md) with `linkTo` renders a link, using the element in [`LinkContext`](api/components/ui/LinkContext.md). `main.tsx` provides [`RouterLink`](api/components/RouterLink.md), which picks how each link is followed:

| Link                              | Followed by                       | Because                                            |
| --------------------------------- | --------------------------------- | -------------------------------------------------- |
| `/about`, `/docs?tab=2`           | The router, without a page reload | They're pages of this app                          |
| `#section`                        | The browser                       | An anchor on the current page                      |
| `/report.pdf`, `/images/logo.png` | The browser                       | A path with a file extension is a file, not a page |
| `/api/...`                        | The browser                       | Served by the API server, not this app             |
| `https://example.com`             | The browser                       | Another site                                       |

If your site has other paths the app doesn't handle, add their prefix to `SERVER_PATHS` in `RouterLink.tsx`. Otherwise the router takes them and shows the 404 page.

The components don't depend on the router: without `LinkContext`, `AppButton` renders a plain `<a>`, so they also work in an app without one.

## Scrolling

The router doesn't scroll when it changes pages. `ScrollToHash` does what a full page load would:

- A link to `/docs#install` scrolls to the element with `id="install"`.
- A link to a new page without a hash scrolls to the top.
- Back and forward leave the scroll position to the browser, which puts back where you were.

It only finds elements that are on the page when it first renders. For content that loads later, such as fetched data, scroll to it yourself once it's there.
