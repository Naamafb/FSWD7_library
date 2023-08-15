import { useParams, useEffect, useState } from "react";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';

import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button } from "@mui/material";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import OutlinedInput from '@mui/material/OutlinedInput';


function CreateNewBook({ book_name }) {
    console.log(book_name);
    const [isFieldEnabled, setIsFieldEnabled] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("currentUser")));
    const [newbook, setBook] = useState({
        book_name: book_name,
        author_name: "",
        categories: [],
        publication_year: "",
        owner_code: user.id,
        availability: false,
        borrower_username: ""
    });

    const [PYError, setPYError] = useState('');
    const [isFildsOk, setFields] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    useEffect(() => {
        console.log("useeffect");
        const myCategoriesFromLocal = JSON.parse(localStorage.getItem('myCategoriesList'));
        if (myCategoriesFromLocal) {
            console.log("exist");
            setCategories(myCategoriesFromLocal);
        }
        else {
            const url = "http://localhost:3000/category";
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            };
            fetch(url, requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    // התוצאה כאן היא מערך של הקטגוריות
                    console.log(data);
                    localStorage.setItem('myCategoriesList', JSON.stringify(data));
                    setCategories(data);
                })
                .catch((error) => {
                    console.error("Error fetching categories:", error);
                    alert("Error fetching categories");
                });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();        
        console.log("handleSubmit");
        console.log(newbook);
        const url = "http://localhost:3000/book/newBook";
        const book=newbook;
        book.book_name=book_name;
        console.log(book);
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ book, selectedCategories }),
        };
        fetch(url, requestOptions)
            .then((response) => {
                if (response.status === 202) {
                    console.log(response);
                    return response.json();
                } else
                    // if (response.status === 409) {
                    throw "Username or password already exists";
                //  }
            })
            .then((u) => {
                console.log(u);
                console.log("the book added");
                window.location.reload();
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            });
    };

    const handleCategoryChange = (e) => {
        const categoryName = e.target.value;
        console.log(categoryName);
        console.log(selectedCategories);
        if (e.target.checked) {
            setSelectedCategories([...selectedCategories, categoryName]);
        } else {
            setSelectedCategories(selectedCategories.filter((category) => category !== categoryName));
        }
    };

    const handlePYChange = (e) => {
        const publicationY = e.target.value;
        if (publicationY < 1900 || publicationY > 2023) {
            setPYError("publication year must be between 1900 and 2023");
        } else {
            setPYError("");

        }
        setBook({ ...newbook, publication_year: publicationY });
    };

    return (
        <Container maxWidth="sm">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h5>The book does not exist, please add book details:</h5>
            </div>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Author name"
                        variant="outlined"
                        fullWidth
                        value={newbook.author_name}
                        onChange={(e) => setBook({ ...newbook, author_name: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Publication year"
                        variant="outlined"
                        fullWidth
                        value={newbook.publication_year}
                        // onChange={(e) => setBook({ ...newbook, publication_year: e.target.value })}
                        onChange={handlePYChange}
                        error={PYError !== ""}
                        helperText={PYError}
                    />
                </Grid>
            </Grid>
            <div style={{ marginTop: '20px' }}>
                <FormControl sx={{ width: '100%', textAlign: 'center' }}>
                    <InputLabel id="demo-multiple-checkbox-label">Select Categories</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={selectedCategories}
                        input={<OutlinedInput label="Select Categories" />}
                        onChange={handleCategoryChange}
                        renderValue={
                            (selected) =>
                                categories.filter(category =>
                                    selected.includes(`${category.id}`)).map(category =>
                                        category.category_name).join(', ')
                        }
                    >
                        {categories.map((category, index) => (
                            <MenuItem key={index} value={category.id}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            onChange={handleCategoryChange}
                                            value={category.id}
                                            color="primary"
                                        />
                                    }
                                    label={category.category_name}
                                />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={newbook.publication_year===""}>
                    Add Book
                </Button>
            </div>
        </Container>
    );
}


export default CreateNewBook;