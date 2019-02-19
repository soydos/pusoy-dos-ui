# Pusoy Dos UI

Pusoy Dos UI is the React frontend for soydos.com

## Prereqs
- node 8.10
- npm 6.5.0

## Setup (React application only)
- run `npm install` to install dependencies
- run `npm run start` to run webserver
- navigate to `localhost:8080`

## Development Pipeline and wasm dependencies

The Pusoy Dos logic for PDUI is written in rust and imported
into the react application using wasm. The compiled wasm binary
is published to npm under the name
[wasm-pusoy-dos](https://github.com/benbrunton/wasm-pusoy-dos).
This package in turn depends on a cargo package published as 
[pusoy_dos2](https://github.com/benbrunton/pusoy_dos2).

Updates to `pusoy_dos2` can only be surfaced in PDUI by
recompiling the wasm bindings in `wasm-pusoy-dos`.

The following directory setup is suggested to enable development
across the complete code pipeline:

```
.
+-- pusoy-dos-project
|   +-- pusoy-dos-ui
|       +-- node_modules
|           +-- wasm-pusoy-dos (symlinked to below)
|   +-- wasm-pusoy-dos
|   +-- pusoy_dos2

```

In the layout above, note that the node_module, `wasm-pusoy-dos`
has a symlink to the sibling directory of `pusoy-dos-ui` of the
same name. The rust dependency does not require a symlink as the
link to the local directory is handled by `cargo`


## Contributing
Yeah sure. Every single interface and component is in flux though
so best let me know if you intend to contribute. Or a surprise PR.
