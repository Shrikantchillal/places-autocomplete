
import React from 'react';
import { useRef, useEffect, useMemo } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Grid, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import parse from 'autosuggest-highlight/parse';
import throttle from "lodash/throttle";

// import { makeStyles } from '@mui/styles';

// const useStyles: any = makeStyles((theme: any) => ({
//     icon: {
//         color: theme.palette.text.secondary,
//         marginRight: theme.spacing(2),
//     },
// }));

const AutoComplete = () => {
    // const classes = useStyles();
    const [value, setValue] = React.useState<any>(null);
    const [inputValue, setInputValue] = React.useState<string>("");
    const [options, setOptions] = React.useState<any[]>([]);

    const autocompleteService = useRef<any>();
    const inputRef = useRef<any>();
    const top100Films = [
        { label: 'The Shawshank Redemption', year: 1994 },
    ]

    // const options = {
    //     fields: ["formatted_address", "geometry", "name"],
    //     strictBounds: false,
    // };

    const fetch = useMemo(
        () =>
            throttle((request: any, callback: any) => {
                autocompleteService.current.getPlacePredictions(request, callback);
            }, 200),
        []
    );
    useEffect(() => {
        // autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        //     inputRef.current,
        //     options
        // );
        // autoCompleteRef.current.addListener("place_changed", async function () {
        //     const place = await autoCompleteRef.current.getPlace();
        //     console.log({ place });
        // });

        let active = true;

        if (!autocompleteService.current && window.google) {
            autocompleteService.current =
                new window.google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
            return undefined;
        }

        if (inputValue === "") {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ input: inputValue }, (results: any) => {
            if (active) {
                let newOptions: any[] = [];

                if (value) {
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
    }, [value, fetch, inputValue]);

    return (
        <div>
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
                onChange={(event, newValue) => {
                    setOptions(newValue ? [newValue, ...options] : options);
                    setValue(newValue);
                }}
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
                    const matches = option?.structured_formatting?.main_text_matched_substrings;
                    const parts = parse(
                        option?.structured_formatting?.main_text,
                        matches?.map((match: any) => [match.offset, match.offset + match.length])
                    );

                    return (
                        <Grid container alignItems="center">
                            <Grid item>
                                <LocationOnIcon />
                            </Grid>
                            <Grid item xs>
                                {parts?.map((part, index) => (
                                    <span
                                        key={index}
                                        style={{ fontWeight: part.highlight ? 700 : 400 }}
                                    >
                                        {part.text}
                                    </span>
                                ))}

                                <Typography variant="body2" color="textSecondary">
                                    {option?.structured_formatting.secondary_text}
                                </Typography>
                            </Grid>
                        </Grid>
                    );
                }}
            />
            {/* <TextField ref={inputRef} /> */}
            {/* <input ref={inputRef} /> */}
        </div>
    );
};
export default AutoComplete;