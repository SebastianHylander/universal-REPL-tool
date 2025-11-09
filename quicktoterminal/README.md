# quicktoterminal
This is my extension to make interactive terminal easier by copying selected code into the terminal by pressing alt+enter

## How to use:
### Register language
To register a language open a file of the desired language and run the command `UREPL: Configure REPL for Language`. Then give your repl-terminal a name and write the startup command needed to open the repl e.g. `python3` for python

### Use the REPL
When the language has been registered simply select the code you want to run in repl and press `alt+enter` and it will open the corresponding terminal using the provided startup command (if the terminal is not open already) and run the codesnippit
