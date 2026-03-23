# Data

Pipeline for matching airport IATA codes to file extensions that share the same 3-letter code.

## Sources

- **Airport codes** — collected by Switcheristic Telecoms, stored in a [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1-e0R5g0bxHR13W1JrfYqPf33qkssX3z_Sjg43osodFU/edit#gid=352282743) and exported as `airport_codes.csv`
- **File extensions** — `filetypes.csv` and NirSoft's extension database (`nirsoft-extensions-full.csv`)

## Notebooks

| Notebook | Purpose |
|---|---|
| `airport_code_cleanup.ipynb` | Cleans and normalizes the raw airport CSV |
| `filetypes_cleanup.ipynb` | Cleans the filetype dataset |
| `nirsoft-extensions-simplifier.ipynb` | Simplifies NirSoft's verbose extension list |
| `nirsoft_airport_matcher.ipynb` | Matches airports to filetypes by IATA code |
| `aggregate.ipynb` | Merges everything into the final dataset |

## Output

`airport_codes_with_filetypes.json` — the merged dataset consumed by the frontend.
