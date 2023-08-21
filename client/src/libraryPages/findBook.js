import { useParams, useEffect, useState } from "react";
import BookComponent from './Content'

import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';

import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';
import { Divider } from '@mui/material';

function FindBook() {

    const [bookName, setBookName] = useState('');
    const [publicationYear, setPublicationYear] = useState('');
    const [authorName, setAuthorName] = useState('')
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [volums, setV] = useState([]);
    const [showFilteredBooks, setBooks] = useState(false);



    useEffect(() => {
        console.log("useeffect");

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
        // }
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();
        console.log(bookName);
        const filterModel = { book_name: bookName, publication_year: publicationYear, categories: selectedCategories, author_name: authorName }
        // const url = "http://localhost:3000/findbook/filter";
        const url = "http://localhost:3000/findbook/filterBooks";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(filterModel),
        };
        console.log(filterModel);
        await fetch(url, requestOptions)
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    console.log("status 200");
                    return response.json();
                } else
                    // if (response.status === 409) {
                    throw "problem with search book with filter";
                //  }
            })
            .then((u) => {
                console.log(u);
                if (u.length > 0) {
                    console.log(volums);
                    setV(u);
                    console.log(volums);
                    setBooks(true);
                    localStorage.setItem('myFilterBooksList', JSON.stringify(u));
                }
                else{
                    setBooks(false)
                }
                console.log("ok search");
            })
            .catch((error) => {
                setBooks(false)
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
    const bdika=()=>{
        alert("its okkkk")
    }

    return (
        <div className="App">
                            <br></br>

            <form onSubmit={handleSearch} className="searchForm">
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            label="Book Name"
                            value={bookName}
                            onChange={(e) => setBookName(e.target.value)}
                            fullWidth
                            sx={{ width: '100%', textAlign: 'center' }}
                            inputProps={{ style: { fontSize: 14 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            label="Publication Year"
                            value={publicationYear}
                            onChange={(e) => setPublicationYear(e.target.value)}
                            fullWidth
                            sx={{ width: '100%', textAlign: 'center' }}
                            inputProps={{ style: { fontSize: 14 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            label="Author name"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            fullWidth
                            sx={{ width: '100%', textAlign: 'center' }}
                            inputProps={{ style: { fontSize: 14 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
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
                    </Grid>
                </Grid>
                <br></br>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Search
                </Button>
            </form>
            <div>
            <br></br>

            <Divider />

                {showFilteredBooks ?
                    // (<BookComponent booksVolums={volums}/>)
                    (<BookComponent booksVolums={volums} updateAfterChange={bdika}/>
                    )
                    : (<div> no results </div>)
                }
            </div>
        </div>
    );

}
export default FindBook;
