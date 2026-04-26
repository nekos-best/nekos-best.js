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

3. (!) `NbCategories` has been renamed to `Category`. Additionally, two more
  specific union types are exported; namely `ArtworkCategory` and
  `RoleplayCategory`.

4. (!) `NbIndividualResponse` has been removed in favor of the `Asset`,
  `ArtworkAsset` and `RoleplayAsset` classes with stronger types. Refer to the
  list below for property changes:
    - `<NbIndividualResponse>.source_url` -> `<ArtworkAsset>.sourceUrl`
    - `<NbIndividualResponse>.artist_href` -> `<ArtworkAsset>.artist.profileUrl`
    - `<NbIndividualResponse>.artist_name` -> `<ArtworkAsset>.artist.name`
    - `<NbIndividualResponse>.anime_name` -> `<RoleplayAsset>.anime.name`

5. (!) `NbResponse` has been replaced by `FetchAssets<E extends Asset = Asset>`
  to accommodate for the new client fetch methods.

6. (!) `NbBufferResponse` has been removed with no replacement.
  `<Client>.fetchFile` is still available, albeit with a different signature
  (see below).

7. XXX

 <!-- TODO: Describe `fetchFile` replacement*. -->

1. (!) `ClientOptions` and therefore the single `Client` constructor argument
   has been removed for now due to `RatelimitHandleMode` removal (see below).

2. (!) `RatelimitHandleMode` will always be set to "sleep" mode, that is,
   methods that call the API will indefinitely wait until the API returns a 2XX
   or a 5XX response. If that is undesirable to you, see 11.

3. (!) The `fetchRandom` top-level-function has been removed. Replace it with the
  one-liner `new Client().fetchAssets(category, 1)`.

4. Client methods now accept an `AbortSignal` to abort requests if they take
    too long.

5. (!) `<Client>.fetch` has been renamed to `<Client>.fetchAssets`.

6. Two new methods named `<Client>.fetchArtworkAssets` and
    `<Client>.fetchRoleplayAssets` have been added with stronger types.

7. `<Client>.search` has been split into two methods:
    `<Client>.searchArtworkAssets` and `<Client>.searchRoleplayAssets`.

## 6.0.0

Changelog is unavailable

### Migrate from 5.X.X

**Deprecation notice: Type `NbEndpointMetadata` will be removed in
the 7.X.X version due to recent API changes**

1. `<Client>.fetchRandom()` & `<Client>.fetchMultiple()` methods have been removed
    in favor of the `<Client>.fetch(category, amount)` method.
2. The `<Client>.init()` method has been removed.

## 5.0.0

Changelog unavailable

### Migrate from 4.X.X

1. The `fetchNeko(category)` function has been removed in favor of the
    `<Client>.fetchRandom()` method and its shortcut `fetchRandom()`.
2. The optional parameter `amount` of the `fetchNeko()` function has been
    removed in favor of the `<Client>.fetchMultiple()` method.
3. The optional options `max` and `min` of the `fetchNeko()` function have been
    removed.
