// import React from "react";
// import TextField from "@material-ui/core/TextField";
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import LocationOnIcon from "@material-ui/icons/LocationOn";
// import Grid from "@material-ui/core/Grid";
// import Typography from "@material-ui/core/Typography";
// import { makeStyles } from "@material-ui/core/styles";
// import parse from "autosuggest-highlight/parse";
// import throttle from "lodash/throttle";

import React from 'react';
import { useRef, useEffect, useMemo } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Grid, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import parse from 'autosuggest-highlight/parse';
import throttle from "lodash/throttle";

// function loadScript(src: string, position: HTMLElement, id: string) {
//     if (!position) {
//         return;
//     }

//     const script = document.createElement("script");
//     script.setAttribute("async", "");
//     script.setAttribute("id", id);
//     script.src = src;
//     position.appendChild(script);
// }

const autocompleteService: any = { current: null };

// const useStyles = makeStyles((theme) => ({
//     icon: {
//         color: theme.palette.text.secondary,
//         marginRight: theme.spacing(2),
//     },
// }));

export default function GoogleMaps() {
    // const classes = useStyles();
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState<string>("");
    const [options, setOptions] = React.useState<any[]>([]);
    const loaded = React.useRef(false);

    // if (typeof window !== "undefined" && !loaded.current) {
    //     if (!document.querySelector("#google-maps")) {
    //         loadScript(
    //             "https://maps.googleapis.com/maps/api/js?key=AIzaSyB8tEQW4C-3mGRoUI7kbxhAk2-jRC10Pa8&libraries=places",
    //             document.querySelector("head") as HTMLElement,
    //             "google-maps"
    //         );
    //     }

    //     loaded.current = true;
    // }

    const fetch = React.useMemo(
        () =>
            throttle((request, callback) => {
                //console.log("request", request);
                autocompleteService.current.getPlacePredictions(request, callback);
            }, 200),
        []
    );

    React.useEffect(() => {
        let active = true;

        if (!autocompleteService.current && window.google) {
            autocompleteService.current =
                new window.google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
            return undefined;
        }
        // console.log("autocompleteService", autocompleteService);

        if (inputValue === "") {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ input: inputValue }, (results: any) => {
            if (active) {
                let newOptions: any[] = [];

                if (value) {
                    console.log("value", value);
                    newOptions = [value];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    return (
        <Autocomplete
            id="google-map-demo"
            style={{ width: 300 }}
            getOptionLabel={(option) =>
                typeof option === "string" ? option : option.description
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            // onChange={(event, newValue) => {
            //   if (newValue) {
            //     console.log("newValue", newValue);
            //   }
            //   setOptions(newValue ? [newValue, ...options] : options);
            //   setValue(newValue);
            // }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Add a location"
                    variant="outlined"
                    fullWidth
                />
            )}
            renderOption={(option: any) => {
                const matches =
                    option.structured_formatting.main_text_matched_substrings;
                const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map((match: any) => [match.offset, match.offset + match.length])
                );
                console.log("option", option);
                return (
                    <Grid container alignItems="center">
                        <Grid item>
                            <LocationOnIcon />
                        </Grid>
                        <Grid item xs>
                            {parts.map((part, index) => (
                                <span
                                    key={index}
                                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                                >
                                    {part.text}
                                </span>
                            ))}

                            <Typography variant="body2" color="textSecondary">
                                {option.structured_formatting.secondary_text}
                            </Typography>
                        </Grid>
                    </Grid>
                );
            }}
        />
    );
}
