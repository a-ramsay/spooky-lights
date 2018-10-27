# Spooky Lights
Spooky Lights is a quick script to add a spooky, haunted house vibe to your
Philips Hue home lighting. Currently it supports two effects, `flicker` and
`breathe`.

It is mostly auto discovering and quite easy to configure. The base setup of
the lights is done through the Hue app (or your existing home automation
system) and Spooky Lights just reads the existing state of each light. If
lights are turned off, they will be ignored.

## Installation
Installing can be done via NPM:

```
npm install -g @cartman640/spooky-lights
```

Spooky Lights should then be avaiable on your command line with the command
`spooky-lights`.

## Configuration
### 1. Authentication
Spooky Lights needs to be able to talk to your Hue Bridge. It expects a `.env`
file in the directory that you are running it from containing a `HUE_USER`
variable.

To register a new user on your Hue Bridge, just select the `register-user`
option:

```
? Choose command
  run
  list-lights
> register-user
```

Spooky Lights will prompt you to press the link button on the top of your
Hue Bridge, then press Enter to proceed.

```
? Press the link button on your Hue bridge (Y/n)
```

Once registered, you will be given a username to put into the `.env` file.

### 2. Setting up rules
Spooky Lights reads its rules from a `rules.json` file that lives in the
current working directory. The basic format of this is an array of objects:

```json
[
    {
        "name": "Kitchen",
        "command": "flicker",
        "frequency": 20
    },
    { ... }
]
```

Where `name` is the name of the light from the Hue app, `command` is either
"**flicker**" or "**breathe**" and `frequency` is a number between 0 and 100.

Frequency is the chance that this light will be included in the "effect
lottery". If all lights are the same (e.g. 20) then there is a 20% chance
that an effect will be run, and a `1/n` where `n` is the number of lights
that this particular light will be used.

The rules are evaluated every second.

You can list the available lights for convenience from Spooky Lights, just
select the `list-lights` option:

```
? Choose command
  run
> list-lights
  register-user
```

You will get a list of available lights, non RGB lights will only be able to
use the **flicker** effect (as shown in the output).

## Running
Once your `.env` and `rules.json` files have been setup, you can start Spooky
Lights by selecting the `run` option:

```
? Choose command (Use arrow keys)
> run
  list-lights
  register-user
```

If everything has been configured correctly you should see a conneciton
successful message:

```
? Choose command run
Found bridge: 10.16.2.7
Checking connection...
Connection successful
```

And your lights will begin to flicker.

## Caveats
This relies on your network being configured in such a way that the Hue auto
discovery works for finding the bridge, and it will always use the first bridge
it finds.

Testing has only been completed on the regular Hue White lights, the Extended
Color RGB lights and the light strips.