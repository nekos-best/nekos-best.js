# Changelog

## 7.0.0

This update introduces numerous breaking changes aiming to clean up the codebase
and the public package API. The most notable breaking change is the exclusive
support of ESM modules. See below for more details.

1. (!) `nekos-best.js` has become an ESM-only library. Packages using CommonJS
  modules will need to be migrated to ESM modules to use this version. Deno
  provides [a migration guide](https://deno.com/blog/convert-cjs-to-esm) to help
  you to migrate.

2. (!) `NbEndpointMetadata` has been removed. Use the static properties
  `artworkCategories`, `roleplayCategories`, or `categories` of the `Client`
  class to obtain categories.

3. (!) `NbCategories` has been renamed to `Categories`. Additionally, two more
  specific union types are exported; namely `ArtworkCategories` and
  `RoleplayCategories`.

4. (!) `NbIndividualResponse` has been removed in favor of the `Asset`,
  `ArtworkAsset` and `RoleplayAsset` classes with stronger types.

5. (!) `NbResponse` has been replaced by `GetCategory<T extends Asset = Asset>`
  to accommodate for the new client methods.

6. (!) `NbBufferResponse` has been removed with no replacement.
  `<Client>.fetchFile` is still available, albeit with a different signature
  (see below).

7. (!) *TODO: Describe fetchFile replacement*.

8. (!) `ClientOptions` has been removed due to `RatelimitHandleMode` removal (see
  below).

9. (!) `RatelimitHandleMode` will always be set to "sleep" mode, that is, they
  will indefinitely wait until the API returns a 2XX or a 5XX response. If that
  is undesirable to you, see 11.

10. (!) The `fetchRandom` top-level-function has been removed. Replace it with the
  one-liner `new Client().fetchAssets(category, 1)`.

11. Client methods now accept an `AbortSignal` to abort requests if they take
    too long.

12. (!) `<Client>.fetch` has been renamed to `<Client>.fetchAssets`.

13. Two new methods named `<Client>.fetchArtworkAssets` and
    `<Client>.fetchRoleplayAssets` have been added with stronger types.

## 6.0.0

*Changelog unavailable*

### Migrate from 5.X.X

**Deprecation notice: ❗ The TypeScript type `NbEndpointMetadata` will be removed in the 7.X.X version due to recent API changes**

#### `<Client>.fetchRandom()` & `<Client>.fetchMultiple()` methods have been removed in favor of the `<Client>.fetch(category, amount)` method

```diff
const nekosBest = new Client();

- nekosBest.fetchRandom("neko")
+ nekosBest.fetch("neko", 1)
```

```diff
const nekosBest = new Client();

- nekosBest.fetchMultiple("neko", 15)
+ nekosBest.fetch("neko", 15)
```

#### The `<Client>.init()` method has been removed

```diff
const nekosBest = new Client();

- await nekosBest.init();
```

## 5.0.0

*Changelog unavailable*

#### Migrate from 4.X.X

#### The `fetchNeko(category)` function has been removed in favor of the `<Client>.fetchRandom()` method and its shortcut `fetchRandom()`

```diff
- fetchNeko('category')
+ const nekosBest = new Client();
+
+ nekosBest.fetchRandom('category')
```

```diff
- fetchNeko('category')
+ fetchRandom('category')
```

#### The optional parameter `amount` of the `fetchNeko()` function has been removed in favor of the `<Client>.fetchMultiple()` method

```diff
- fetchNeko('category', 15)
+ const nekosBest = new Client();
+
+ nekosBest.fetchMultiple('category', 15)
```

#### Other Changes

- The optional options `max` and `min` of the `fetchNeko()` function have been removed
