## Migrate from 6.X.X to 7.X.X

- `nekos-best.js` has become an ESM-only library. Packages using CommonJS
  modules will need to be migrated to ESM modules to use this version. Deno
  provides [a migration guide](https://deno.com/blog/convert-cjs-to-esm) to help
  you to migrate.

- `NbEndpointMetadata` has been removed. Use the static properties `artworkCategories`, `roleplayCategories`, or `categories` of the `Client` class to obtain categories.

- `NbCategories` has been renamed to `Categories`. Additionally, two more specific union types are exported; namely `ArtworkCategories` and `RoleplayCategories`.

- `NbIndividualResponse` has been removed in favor of `Asset`, `ArtworkAsset` and `RoleplayAsset` classes with stronger types.

- `NbResponse` has been replaced by `GetCategory<T extends Asset = Asset>` to accommodate for the new client methods.

- `NbBufferResponse` has been removed with no replacement. `<Client>.fetchFile` is still available, albeit with a different signature (see below).

- *TODO: Describe fetchFile replacement*.

- `ClientOptions` has been removed due to `RatelimitHandleMode` removal (see below).

- `RatelimitHandleMode` will always be set to "sleep" mode. Client methods now accept an `AbortSignal` to abort requests if they take too long.

- `<Client>.fetch` has been renamed to `<Client>.fetchAssets`.

- `fetchRandom` top-level-function has been removed. Replace it with the one-liner `new Client().fetchAssets(category, 1)`.

## Migrate from 5.X.X to 6.X.X

**❗ For the TypeScript users, the type `NbEndpointMetadata` will be removed in the 7.X.X version due to recent API changes**

### `<Client>.fetchRandom()` & `<Client>.fetchMultiple()` methods have been removed in favor of the `<Client>.fetch(category, amount)` method

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

### The `<Client>.init()` method has been removed

```diff
const nekosBest = new Client();

- await nekosBest.init();
```

## Migrate from 4.X.X to 5.X.X

### The `fetchNeko(category)` function has been removed in favor of the `<Client>.fetchRandom()` method and its shortcut `fetchRandom()`

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

### The optional parameter `amount` of the `fetchNeko()` function has been removed in favor of the `<Client>.fetchMultiple()` method

```diff
- fetchNeko('category', 15)
+ const nekosBest = new Client();
+
+ nekosBest.fetchMultiple('category', 15)
```

### Other Changes

- The optional options `max` and `min` of the `fetchNeko()` function have been removed
