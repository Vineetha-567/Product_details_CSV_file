const cheerio = require("cheerio");
const axios = require("axios");
const j2cp =  require("json2csv").Parser;
const fs = require("fs");

const mystery="https://books.toscrape.com/catalogue/category/books/mystery_3/index.html"
const baseUrl = "https://books.toscrape.com/catalogue/category/books/mystery_3/";
const prodct_data = []


async function getBooks(url){
    try {
        const response = await axios.get(url);
        const $=cheerio.load(response.data);

        const books = $("article");
        books.each(function(){

            productName = $(this).find("h3 a").text();
            productPrice= $(this).find(".price_color").text();
            stock = $(this).find(".availability").text().trim();

            prodct_data.push({productName, productPrice, stock})
        })

        if($(".next a").length > 0){
            next_page = baseUrl + $(".next a").attr("href");
            getBooks(next_page);
        }else{
            const parser = new j2cp();
            const csv = parser.parse(prodct_data);
            fs.writeFileSync("./products.csv",csv)
        }


        console.log(prodct_data);
        
    } catch (error) {
        console.error(error);
    }

}

getBooks(mystery);