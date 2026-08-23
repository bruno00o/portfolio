# Changelog

## [1.4.1](https://github.com/bruno00o/portfolio/compare/v1.4.0...v1.4.1) (2026-08-23)


### Bug Fixes

* **a11y:** raise dark-mode muted text contrast to AA ([577078c](https://github.com/bruno00o/portfolio/commit/577078c279e59698057011cfc92874df2392f7b3))

## [1.4.0](https://github.com/bruno00o/portfolio/compare/v1.3.0...v1.4.0) (2026-08-23)


### Features

* **content:** add bilingual llms.txt indexes ([254481d](https://github.com/bruno00o/portfolio/commit/254481d51d9112c23b3f399bd7617b8204a565cb))
* **content:** expose raw Markdown endpoints for projects and writing ([eb14e5d](https://github.com/bruno00o/portfolio/commit/eb14e5da6fe42529209a2d7dbacd41bbec6ac3cc))
* **seo:** add JSON-LD structured data for the person, projects and posts ([2f62750](https://github.com/bruno00o/portfolio/commit/2f6275004bfe710bd22cc03dc5087dd208f15e56))
* **seo:** serve robots.txt with content signals and the sitemap ([fba6266](https://github.com/bruno00o/portfolio/commit/fba6266dcc838770f17a6a275b50d18368e8f161))


### Bug Fixes

* **nginx:** serve .md as text/markdown instead of octet-stream ([52d1e89](https://github.com/bruno00o/portfolio/commit/52d1e899fa0e04badf452cef9c307b9c595e44de))

## [1.3.0](https://github.com/bruno00o/portfolio/compare/v1.2.0...v1.3.0) (2026-08-23)


### Features

* **security:** send security headers from nginx ([6fdf3b0](https://github.com/bruno00o/portfolio/commit/6fdf3b029e2b4f086a76ff50ea7be168a59f1401))


### Bug Fixes

* **a11y:** align the language toggle accessible name with its visible text ([92360da](https://github.com/bruno00o/portfolio/commit/92360da33a689bac391a63a96271afec878ce535))
* **nav:** send the rogue dot flying home on double-click ([90ae949](https://github.com/bruno00o/portfolio/commit/90ae9495f5c5d33af393ce702fcaded93dfa16b3))


### Performance Improvements

* **fonts:** serve Geist through the native Astro fonts API ([2774348](https://github.com/bruno00o/portfolio/commit/2774348dea2f9a82040205ccbfc456ed13775883))
* **nav:** rebuild the rogue dot without a Preact island ([1490ed4](https://github.com/bruno00o/portfolio/commit/1490ed4b1445aafd5f4faf5629cfb68579b7fdea))
* **ui:** composite the now-bar pulse animation ([dc5f2a4](https://github.com/bruno00o/portfolio/commit/dc5f2a46062ce92418c72265db67666dfc34190c))

## [1.2.0](https://github.com/bruno00o/portfolio/compare/v1.1.0...v1.2.0) (2026-08-22)


### Features

* **hero:** add a themed 3D bust beside the name ([0b48409](https://github.com/bruno00o/portfolio/commit/0b48409b52d96d2696827db2897299fedded1b47))
* **og:** align the social cards on the site typographic system ([5106388](https://github.com/bruno00o/portfolio/commit/51063884fab010ef681c881b2c667951372204db))
* **seo:** add og:image dimensions and alt text ([9ad87d3](https://github.com/bruno00o/portfolio/commit/9ad87d354cc50d35c5cae5afbea69e5ba5c21aa2))

## [1.1.0](https://github.com/bruno00o/portfolio/compare/v1.0.4...v1.1.0) (2026-08-21)


### Features

* add a bilingual legal notice page ([df600c3](https://github.com/bruno00o/portfolio/commit/df600c33ea6f5b5b2ec75c495aee2750eb37e287))
* **ui:** rework the typographic system ([977f47f](https://github.com/bruno00o/portfolio/commit/977f47fb5f3bcba123185cb30dd17cbb32f0d1a8))


### Bug Fixes

* **og:** resolve the {present} placeholder in project subtitles ([a79bab6](https://github.com/bruno00o/portfolio/commit/a79bab6caef693893f5c917401b955d166e6ec3f))

## [1.0.4](https://github.com/bruno00o/portfolio/compare/v1.0.3...v1.0.4) (2026-08-21)


### Bug Fixes

* **deps:** update astro, satori, preact and astro check ([cda7e6f](https://github.com/bruno00o/portfolio/commit/cda7e6f01b6d7c6edaefee52ef1d7f74b163e415))

## [1.0.3](https://github.com/bruno00o/portfolio/compare/v1.0.2...v1.0.3) (2026-07-26)


### Bug Fixes

* **deps:** update preact, zod, fontsource, satori and sharp ([413c2ca](https://github.com/bruno00o/portfolio/commit/413c2ca11036b49056e647c86d7dc3da12a87bc6))

## [1.0.2](https://github.com/bruno00o/portfolio/compare/v1.0.1...v1.0.2) (2026-07-26)


### Bug Fixes

* **deps:** upgrade to Astro 7 and drop unused @astrojs/mdx ([49bb812](https://github.com/bruno00o/portfolio/commit/49bb812611739af65eeb6f89770ab0e27c3390d4))
* **deps:** upgrade to Astro 7 and drop unused @astrojs/mdx ([e1dd018](https://github.com/bruno00o/portfolio/commit/e1dd018280e00b0e2c31c3c3e2a1ef9b3bcf2fd6))

## [1.0.1](https://github.com/bruno00o/portfolio/compare/v1.0.0...v1.0.1) (2026-07-26)


### Bug Fixes

* **build:** allow esbuild and sharp build scripts under pnpm 11 ([cb30747](https://github.com/bruno00o/portfolio/commit/cb3074789e75fd459a8974c96db558fa7e303f50))

## [1.0.0](https://github.com/bruno00o/portfolio/compare/v0.0.1...v1.0.0) (2026-07-26)


### Bug Fixes

* **404:** align title separator and remove no-op title swap ([ade1631](https://github.com/bruno00o/portfolio/commit/ade16317fb63f98547724d0eff40e6715bb0c6ee))
* **i18n:** redirect to /fr when a french preference is already stored ([160498d](https://github.com/bruno00o/portfolio/commit/160498d2ebb0b16c517fc10675724a2c9312b4d9))
* **og:** add missing image for the 404 page ([3fa7937](https://github.com/bruno00o/portfolio/commit/3fa793741d58eb429583dac6db98cf311bc2774d))
* **writing:** remove archive link pointing to its own section ([a5555a6](https://github.com/bruno00o/portfolio/commit/a5555a6437f317ffa04eb86291c6cc2e6cb41935))
