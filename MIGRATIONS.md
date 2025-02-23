# Migration Guide

## Migrate from 6.X.X to 7.X.X

- The minimum supported Node version is set to v22.0.0.
- `ClientOptions.ratelimitHandleMode` has been removed. Now the default behavior will be "sleep", i.e. to wait until the rate limit passes.
- The `fetchRandom` function has been removed. Use the `<Client>.fetchAssets` method instead with `amount` set to 1.

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
