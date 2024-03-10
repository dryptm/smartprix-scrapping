const express = require("express");
const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const fetch = require('node-fetch'); // Make sure you have the 'node-fetch' package installed
const cheerio = require('cheerio');
const app = express();

const fetchTimeout = (url, timeout) => {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
    ]);
};



// app.get("/electrical/:itemname", (req, res) => {
//     const item_name = req.params.itemname;
//     const result = async () => {
//         var a = ["https://www.google.com/search?q=" + item_name + "+smartprix"];

//         const promises = a.map(async (url, index) => {
//             const response = await fetch(url);
//             const html = await response.text();
//             const $ = cheerio.load(html);
//             const link = $("a").map((j, link) => link.attribs.href).get();
//             var link_real;
//             var retun_result = [];
//             for (var i = 0; i < link.length; i++) {
//                 if (link[i].includes("smartprix.com/")) {
//                     link_real = link[i].split("q=")[1].split("&sa")[0];
//                     console.log(link_real);
//                     break;
//                 }
//             }
//             const smartprix_response = await fetch(link_real);
//             const smartprix_html = await smartprix_response.text();
//             const smartprix$ = cheerio.load(smartprix_html);
//             console.log(smartprix$(".liner").text());
//             console.log(smartprix$(".sm-store-strip").text());
//             var alt_tabs = smartprix$("img.sm-img").map((j, link) => link.attribs.alt).get()
//             var all_img_links = smartprix$("img.sm-img").map((j, link) => link.attribs.src).get()
//             console.log(alt_tabs[17] + "    " + all_img_links[17])
//             var inputString = smartprix$(".sm-store-strip").text();
//             inputString = inputString.split(",").join('').split("₹").join('');

//             // Separate the numbers and strings using regular expressions
//             const Price = inputString.match(/\d+/g);
//             const Provider = inputString.match(/[^\d]+/g);

//             console.log("Numbers:", Price);
//             console.log("Strings:", Provider);

//             const specs = [];
//             const specs_to_pop = []
//             smartprix$('.group>li>span').each(function (i, elem) {
//                 specs[i] = $(this).text();
//             });
//             smartprix$('.group>li>.rank').each(function (i, elem) {
//                 specs_to_pop[i] = $(this).text();
//             });

//             const specs_final = [];
//             var k = 0;
//             for (var i = 0; i < specs.length; i++) {
//                 if (specs[i] == specs_to_pop[k]) {
//                     k++;
//                 } else {
//                     specs_final.push(specs[i])
//                 }
//             }

//             if (Price && Provider && Price.length === Provider.length) {
//                 for (var j = 0; j < Price.length; j++) {
//                     retun_result.push({
//                         Name: alt_tabs[17],
//                         Img: all_img_links[17],
//                         Specs: specs_final,
//                         Provider: Provider[j],
//                         Price: Price[j]
//                     });
//                 }
//             } else {
//                 retun_result.push({
//                     Name: item_name,
//                     Specs: "NA",
//                     Provider: "NA",
//                     Price: "NA"
//                 });
//             }

//             // console.log(retun_result);
//             return retun_result;
//         });

//         return Promise.all(promises);
//     };

//     result().then(data => {
//         const output = {
//             Name: data[0][0].Name,
//             Img: data[0][0].Img,
//             Specs: data[0][0].Specs,
//             Comparison: data[0].map(item => ({
//                 Provider: item.Provider,
//                 Price: item.Price
//             }))
//         };
//         console.log(output)
//         res.send(output);
//     });
// });






// app.get("/electrical_spotlite/spotlite_products", (req, res) => {
//     const result = async () => {
//         try {
//             var a = ["https://www.smartprix.com/deals"];
//             const promises = a.map(async (url, index) => {
//                 try {


//                     const response = await fetch(url); // Add the fetchTimeout function here

//                     if (!response.ok) {
//                         throw new Error(`Failed to fetch ${url}, status: ${response.status}`);
//                     }

//                     const html = await response.text();
//                     const $ = cheerio.load(html);
//                     // const links = $("a").map((j, link) => $(link).text()).get();
//                     // console.log(links);
//                     // console.log($(".sm-deals").html())
//                     return $(".sm-deals").html();
//                 } catch (error) {
//                     console.error("Error fetching", url, error);
//                     return []; // Return an empty array in case of an error
//                 }
//             });
//             return Promise.all(promises);
//         } catch (error) {
//             console.error("Error:", error);
//             throw error; // Re-throw the error so it can be caught by the outer catch block
//         }
//     };

//     result()
//         .then(data => {
//             console.log(data.length);
//             var a=data[0]
//             var x = []
//             for (var i = 1; i < a.split("sm-deal").length; i++) {
//                 x.push({
//                     item: a.split("sm-deal")[i].split("src=")[1].split('\"')[3],
//                     item_img: a.split("sm-deal")[i].split("src=")[1].split('\"')[1],
//                     item_offer_store_redirect_url: a.split("sm-deal")[i].split("src=")[1].split('\"')[23],
//                     item_offer_store: a.split("sm-deal")[i].split("src=")[1].split('\"')[18].split("span")[1].split(">")[1].split("</")[0]
//                 })
//             }
//             res.send(x);
//         })
//         .catch(error => {
//             console.log("Final Error:", error);
//             res.status(500).send("Internal Server Error");
//         });
// });





{}




process.setMaxListeners(Infinity);
var electricalSchema = new mongoose.Schema({
    item_name: String,
    item_IMG: String,
    item_specs: Array,
    category: String,
    category_main: String
});

var ELECTRICALNEWVU = mongoose.model('ELECTRICALNEWVU', electricalSchema);

// // var electrical_categoriesSchema = new mongoose.Schema({
// //     category_main: String,
// //     category: String
// // });

// // var ELECTRICAL_CATEGORIES = mongoose.model('ELECTRICAL_CATEGORIES', electrical_categoriesSchema);


const category_groups = ["Mobiles & Tablets", "Laptops, Computers & TVs", "Electronics", "Large Appliances", "Small Appliances", "Computer Accessories", "Kitchen Accessories", "Grooming Appliances", "Headphones and Earphones"];
// const categories_full = ["Tablets", "Mobiles", "Laptops", "TVs", "Computers", "Cameras", "Smart watches", "Fitness bands", "Gaming consoles", "Gamepads & Joystics", "ACs", "Refrigerators", "Washing Machines", "Air Coolers", "Geysers", "Irons", "Vaccume Cleaners", "RAMs", "Processors(CPU)", "PSUs", "Graphics Cards", "MotherBoards", "Internal Hard Drives", "Monitors", "Printers", "Memory Cards", "Speakers", "Power Banks", "Pen Drives", "External Hard Disks", "Mouse", "Mixer Juicer Grinder", "Induction Cooktops", "Microwave owens", "chimneys", "Hand Blenders", "Electric Kettles", "Trimmers", "Shavers", "Hair Dryers", "Hair Straightners", "Hair Curlers", "Headphones and Earphones"]

// // app.get("/update_cat", (req, res) => {
// //     for (var i = 0; i < categories_full.length; i++) {
// //         var new_electrical = new ELECTRICAL_CATEGORIES({
// //             category_main: getCategoryMain(categories_full[i]),
// //             category: categories_full[i]
// //         })
// //         new_electrical.save().then(function (err, savedelectrical) {
// //             if (err) {
// //                 console.log(err)
// //             } else {
// //                 console.log(savedelectrical)
// //             }
// //         })
// //     }

// // })

// // function getCategoryMain(category) {
// //     // Implement your logic here to map the category to category_groups
// //     // Example logic:
// //     switch (category) {
// //         case "Tablets":
// //         case "Mobiles":
// //             return category_groups[0];
// //         case "Laptops":
// //         case "Computers":
// //         case "TVs":
// //             return category_groups[1];
// //         case "Cameras":
// //         case "Smart watches":
// //         case "Fitness bands":
// //         case "Gaming consoles":
// //         case "Gamepads & Joystics":
// //             return category_groups[2];
// //         case "ACs":
// //         case "Refrigerators":
// //         case "Washing Machines":
// //         case "Air Coolers":
// //             return category_groups[3];
// //         case "Geysers":
// //         case "Irons":
// //         case "Vaccume Cleaners":
// //             return category_groups[4];
// //         case "RAMs":
// //         case "Processors(CPU)":
// //         case "PSUs":
// //         case "Graphics Cards":
// //         case "MotherBoards":
// //         case "Internal Hard Drives":
// //         case "Monitors":
// //         case "Printers":
// //         case "Memory Cards":
// //         case "Speakers":
// //         case "Power Banks":
// //         case "Pen Drives":
// //         case "External Hard Disks":
// //         case "Mouse":
// //             return category_groups[5];
// //         case "Mixer Juicer Grinder":
// //         case "Induction Cooktops":
// //         case "Microwave owens":
// //         case "chimneys":
// //         case "Hand Blenders":
// //         case "Electric Kettles":
// //             return category_groups[6];
// //         case "Trimmers":
// //         case "Shavers":
// //         case "Hair Dryers":
// //         case "Hair Straightners":
// //         case "Hair Curlers":
// //             return category_groups[7];
// //         case "Headphones and Earphones":
// //             return category_groups[8];
// //         default:
// //             return "Default Category";
// //     }
// // }


async function scrapeDataFromURL(url, category) {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized']
    });
    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: 'networkidle2'
    });

    var limit = await page.evaluate(() => {
        return [document.querySelectorAll(".pg-prf-head")[0].innerText.split(" ")[0].split(",").join(""), document.querySelectorAll(".name h2").length]
    });

    console.log(parseInt(parseInt(limit[0]) / limit[1]) + "*20 " + category);

    var a = [];

    for (let i = 0; i < parseInt(parseInt(limit[0]) / limit[1]); i++) {
        try {
            await page.waitForSelector('.sm-load-more');
            await page.click('.sm-load-more');
            console.log(i);
            await page.waitForTimeout(1000);
            if (i < parseInt(parseInt(limit[0]) / limit[1]) - 1) {
                continue;
            } else {
                var prop1 = await page.evaluate((category, category_groups) => {

                    var a = [];

                    for (var i = 0; i < document.querySelectorAll(".name h2").length; i++) {
                        if (document.querySelectorAll(".has-actions")[i].innerHTML.includes('class="tag"')) {
                            continue;
                        } else {
                            var object = {
                                item_name: document.querySelectorAll(".name h2")[i].innerHTML,
                                item_IMG: document.querySelectorAll(".sm-img-wrap img")[i].src,
                                // item_specs: document.querySelectorAll(".sm-feat.specs")[i].innerText.split('\n'),
                                category: category,
                                category_main: getCategoryMain(category)
                            };

                            function getCategoryMain(category) {
                                // Implement your logic here to map the category to category_groups
                                // Example logic:
                                switch (category) {
                                    case "Tablets":
                                    case "Mobiles":
                                        return category_groups[0];
                                    case "Laptops":
                                    case "Computers":
                                    case "TVs":
                                        return category_groups[1];
                                    case "Cameras":
                                    case "Smart watches":
                                    case "Fitness bands":
                                    case "Gaming consoles":
                                    case "Gamepads & Joystics":
                                        return category_groups[2];
                                    case "ACs":
                                    case "Refrigerators":
                                    case "Washing Machines":
                                    case "Air Coolers":
                                        return category_groups[3];
                                    case "Geysers":
                                    case "Irons":
                                    case "Vaccume Cleaners":
                                        return category_groups[4];
                                    case "RAMs":
                                    case "Processors(CPU)":
                                    case "PSUs":
                                    case "Graphics Cards":
                                    case "MotherBoards":
                                    case "Internal Hard Drives":
                                    case "Monitors":
                                    case "Printers":
                                    case "Memory Cards":
                                    case "Speakers":
                                    case "Power Banks":
                                    case "Pen Drives":
                                    case "External Hard Disks":
                                    case "Mouse":
                                        return category_groups[5];
                                    case "Mixer Juicer Grinder":
                                    case "Induction Cooktops":
                                    case "Microwave owens":
                                    case "chimneys":
                                    case "Hand Blenders":
                                    case "Electric Kettles":
                                        return category_groups[6];
                                    case "Trimmers":
                                    case "Shavers":
                                    case "Hair Dryers":
                                    case "Hair Straightners":
                                    case "Hair Curlers":
                                        return category_groups[7];
                                    case "Headphones and Earphones":
                                        return category_groups[8];
                                    default:
                                        return "Default Category";
                                }
                            }

                            a.push(object);
                        }


                    }
                    return a
                }, category, category_groups);

                // console.log(prop1);
                a = a.concat(prop1); // Concatenate the arrays
            }
        } catch (error) {
            console.error(`Error occurred during iteration ${i}:`, error);
        }
    }

    await browser.close();
    return a;
}

async function big() {
    const categories = ["Tablets", "Mobiles", "Mobiles", "Mobiles", "Mobiles", "Mobiles", "Mobiles", "Laptops", "Laptops", "Laptops", "Laptops", "Laptops", "Laptops", "Laptops", "Laptops", "Laptops", "Laptops", "Laptops", "Laptops", "Laptops", "Laptops", "Laptops", "Laptops", "Laptops", "TVs", "TVs", "TVs", "TVs", "TVs", "Computers", "Cameras", "Cameras", "Cameras", "Smart watches", "Smart watches", "Fitness bands", "Gaming consoles", "Gamepads & Joystics", "ACs", "ACs", "ACs", "ACs", "Refrigerators", "Refrigerators", "Refrigerators", "Refrigerators", "Washing Machines", "Washing Machines", "Washing Machines", "Washing Machines", "Air Coolers", "Air Coolers", "Air Coolers", "Geysers", "Geysers", "Geysers", "Irons", "Irons", "Vaccume Cleaners", "RAMs", "Processors(CPU)", "PSUs", "Graphics Cards", "MotherBoards", "Internal Hard Drives", "Monitors", "Monitors", "Monitors", "Monitors", "Printers", "Memory Cards", "Memory Cards", "Speakers", "Power Banks", "Pen Drives", "External Hard Disks", "Mouse", "Mixer Juicer Grinder", "Induction Cooktops", "Microwave owens", "chimneys", "Hand Blenders", "Electric Kettles", "Trimmers", "Shavers", "Hair Dryers", "Hair Straightners", "Hair Curlers", "Headphones and Earphones", "Headphones and Earphones", "Headphones and Earphones", "Headphones and Earphones", "Headphones and Earphones", "Headphones and Earphones"]
    const categories_url = ["https://www.smartprix.com/tablets/realme-samsung-vivo-oppo-oneplus-xiaomi-motorola-iqoo-apple-nothing-sony-asus-lg-panasonic-brand",
     "https://www.smartprix.com/mobiles/apple-asus-iqoo-lg-brand",
      "https://www.smartprix.com/mobiles/motorola-nothing-oneplus-oppo-brand",
       "https://www.smartprix.com/mobiles/panasonic-realme-brand",
        "https://www.smartprix.com/mobiles/samsung-brand",
         "https://www.smartprix.com/mobiles/sony-vivo-brand",
          "https://www.smartprix.com/mobiles/xiaomi-brand",
           "https://www.smartprix.com/laptops/acer-brand",
            "https://www.smartprix.com/laptops/agb-brand",
             "https://www.smartprix.com/laptops/alienware-brand",
              "https://www.smartprix.com/laptops/apple-brand",
               "https://www.smartprix.com/laptops/asus-brand",
                "https://www.smartprix.com/laptops/avita-brand",
                 "https://www.smartprix.com/laptops/dell-brand",
                  "https://www.smartprix.com/laptops/gigabyte-google-hcl-honor-brand",
                   "https://www.smartprix.com/laptops/hp-brand",
                    "https://www.smartprix.com/laptops/huawei-infinix-lava-brand",
                     "https://www.smartprix.com/laptops/lenovo-brand",
                      "https://www.smartprix.com/laptops/lg-micromax-microsoft-brand",
                       "https://www.smartprix.com/laptops/msi-brand",
                        "https://www.smartprix.com/laptops/razer-realme-samsung-brand",
                         "https://www.smartprix.com/laptops/sony-brand",
                          "https://www.smartprix.com/laptops/toshiba-brand",
                           "https://www.smartprix.com/laptops/walker-wipro-xiaomi-brand",
                            "https://www.smartprix.com/tvs/samsung-brand",
                             "https://www.smartprix.com/tvs/lg-brand",
                              "https://www.smartprix.com/tvs/sony-xiaomi-tcl-panasonic-acer-brand",
                               "https://www.smartprix.com/tvs/haier-vu-hisense-lloyd-onida-sansui-thomson-croma-motorola-brand",
                                "https://www.smartprix.com/tvs/micromax-toshiba-infinix-oneplus-intex-kodak-philips-hyundai-nokia-compaq-impex-akai-coocaa-videocon-realme-marq-reconnect-brand",
                                 "https://www.smartprix.com/computers/hp-asus-dell-apple-lenovo-zebronics-iball-intel-acer-enter-foxin-frontech-msi-brand",
                                  "https://www.smartprix.com/cameras/sony-canon-brand",
                                   "https://www.smartprix.com/cameras/nikon-panasonic-brand",
                                    "https://www.smartprix.com/cameras/fujifilm-samsung-gopro-olympus-kodak-sjcam-insta360-dji-fitspark-ricoh-blessbe-jvc-procus-leica-pentax-benq-cason-digitek-izi-qubo-wespro-aiptek-blackmagic-design-campark-casio-merlin-polaroid-xiaomi-akaso-andoer-astrum-camlink-clickpro-eken-feiyutech-hypex-inext-iroad-kamron-mezire-netgen-ng-noise-owo-philips-sigma-brand",
                                     "https://www.smartprix.com/smartwatches/amazon-flipkart-store",
                                      "https://www.smartprix.com/smartwatches/boat-croma-gonoise-myntra-portronics-samsung-store",
                                       "https://www.smartprix.com/fitness_bands/acer-amazfit-amazon-ambrane-amza%20tech-benison%20india-bingo-boat-boltt-cactus-callmate-celestech-cubot-diggro-elephone-enew-enhance-f_h-fastgo-fastrack-fbandz-fire-fitbit-fitmate-fossil-fsf-garmin-goqii-hammer-helix-honor-huawei-infinix-itel-lava-lenovo-mevofit-noise-omnix-oneplus-oppo-pebble-ptron-punnkfunnk-realme-samsung-sonata-tenor-timex-xiaomi-zebronics-brand",
                                        "https://www.smartprix.com/gaming_consoles/amkette-asus-ayaneo-gpd-lenovo-logitech-microsoft-nintendo-onexplayer-razer-sony-brand",
                                         "https://www.smartprix.com/gamepads_joysticks/3m-amigo-amkette-ant%20esports-astrum-atek-claw-cosmic%20byte-digiflip-enter-frontech-genius-gizmo-havit-hcl-hytech%20plus-ipega-jio-live%20tech-logitech-mad%20catz-microsoft-microware-mobilegear-nitho-nokia-powera-quantum-razer-red%20gear-sony-speed-steelseries-svb-thrustmaster-zebronics-brand",
                                          "https://www.smartprix.com/air_conditioners/amazon-store",
                                           "https://www.smartprix.com/air_conditioners/croma-store",
                                            "https://www.smartprix.com/air_conditioners/flipkart-store",
                                             "https://www.smartprix.com/air_conditioners/samsung-store",
                                              "https://www.smartprix.com/refrigerators/amazon-store",
                                               "https://www.smartprix.com/refrigerators/croma-store",
                                                "https://www.smartprix.com/refrigerators/flipkart-store",
                                                 "https://www.smartprix.com/refrigerators/samsung-store",
                                                  "https://www.smartprix.com/washing_machines/amazon-store",
                                                   "https://www.smartprix.com/washing_machines/croma-store",
                                                    "https://www.smartprix.com/washing_machines/flipkart-store",
                                                     "https://www.smartprix.com/washing_machines/samsung-store",
                                                      "https://www.smartprix.com/air_coolers/amazon-store",
                                                       "https://www.smartprix.com/air_coolers/croma-store",
                                                        "https://www.smartprix.com/air_coolers/flipkart-store",
                                                         "https://www.smartprix.com/geysers/flipkart-store",
                                                          "https://www.smartprix.com/geysers/croma-store",
                                                           "https://www.smartprix.com/geysers/amazon-store",
                                                            "https://www.smartprix.com/irons/acs-activa-adistar-agaro-airex-aisen-ajanta%20quartz-alfalite-amazonbasics-american%20micronic-amikan-bajaj-brand",
                                                             "https://www.smartprix.com/irons/bajaj%20platini-baltra-black_decker-boss-bpl-butterfly-croma-crompton-flipkart%20smartbuy-glen-gm-havells-inalsa-lazer-longway-milton-morphy%20richards-nova-orient-orpat-oster-panasonic-philips-prolife-rally-rico-russell%20hobbs-singer-skyline-skystar-summerking-sunflame-surya-syska-tosiba-usha-warmex-wipro-brand",
                                                              "https://www.smartprix.com/vacuum_cleaners/%20skil-adistar-agaro-aimex-amazonbasics-american%20micronic-aulto-baltra-balzano-baseus-bergmann-birla%20lifestyle-bissell-black%20and%20decker-black_decker-bosch-bosch%20-btali-cheston-croma-deerma-defort-dibea-dreame-dustor-dynavac-dyson-eastman-ecovacs-electrolux-eufy-eureka%20forbes-hpd-ilife-inalsa-irobot-kortex-lg-lyrovo-mecturing-miele-milagrow-nova-osmon-panasonic-philips-prestige-realme-rng-samsung-xiaomi-brand",
                                                               "https://www.smartprix.com/computer_ram/adata-corsair-crucial-hynix-hyperx-kingston-samsung-simmtronics-transcend-brand",
                                                                "https://www.smartprix.com/computer_processors",
                                                                 "https://www.smartprix.com/computer_psu",
                                                                  "https://www.smartprix.com/computer_graphic_cards",
                                                                   "https://www.smartprix.com/computer_motherboards",
                                                                    "https://www.smartprix.com/internal_hard_drives",
                                                                     "https://www.smartprix.com/monitors/amazon-store",
                                                                      "https://www.smartprix.com/monitors/croma-store",
                                                                       "https://www.smartprix.com/monitors/flipkart-store",
                                                                        "https://www.smartprix.com/monitors/samsung-store",
                                                                         "https://www.smartprix.com/printers",
                                                                          "https://www.smartprix.com/mobile_memory_cards/sandisk-samsung-brand",
                                                                           "https://www.smartprix.com/mobile_memory_cards/hp-kingston-adata-lexar-apple-croma-flipkart smartbuy-sony-strontium-transcend-western digital-amigo-amkette-angry birds-apacer-axl-brainbell-captcha-copper-dell-energizer-extra-g.skill-gigastone-goodit-hi-ten-hitech-iball-joy-karbonn-karpine-kdm-kodak-lenovo-lg-lorem-maxspace-mediaman-mercury-mmc-nikon-nitho-ortel-pny-portronics-rage-red gear-reliable-brand",
                                                                            "https://www.smartprix.com/mobile_speakers/amazon-boat-croma-flipkart-gonoise-myntra-portronics-store",
                                                                             "https://www.smartprix.com/mobile_power_banks/amazon-boat-croma-flipkart-portronics-store",
                                                                              "https://www.smartprix.com/pen_drives/amazon-croma-flipkart-store",
                                                                               "https://www.smartprix.com/external_hard_disks/amazon-croma-flipkart-store",
                                                                                "https://www.smartprix.com/computer_mouse/amazon-croma-flipkart-portronics-store",
                                                                                 "https://www.smartprix.com/mixer_juicer_grinders/amazon-croma-flipkart-pepperfry-store",
                                                                                  "https://www.smartprix.com/induction_cooktops",
                                                                                   "https://www.smartprix.com/microwave_ovens",
                                                                                    "https://www.smartprix.com/chimneys/amazon-croma-flipkart-store",
                                                                                     "https://www.smartprix.com/hand_blenders",
                                                                                      "https://www.smartprix.com/electric_kettles/amazon-croma-flipkart-pepperfry-store",
                                                                                       "https://www.smartprix.com/trimmers/amazon-beardo-croma-flipkart-myntra-pepperfry-store",
                                                                                        "https://www.smartprix.com/shavers",
                                                                                         "https://www.smartprix.com/hair_dryers",
                                                                                          "https://www.smartprix.com/hair_straighteners",
                                                                                           "https://www.smartprix.com/hair_curlers",
                                                                                            "https://www.smartprix.com/mobile_headphones/boat-realme-boult-jbl-oneplus-noise-brand",
                                                                                             "https://www.smartprix.com/mobile_headphones/zebronics-sony-ptron-oppo-ubon-mivi-brand",
                                                                                              "https://www.smartprix.com/mobile_headphones/wings-u_i-samsung-apple-soundcore-xiaomi-portronics-truke-brand",
                                                                                               "https://www.smartprix.com/mobile_headphones/sennheiser-fire-boltt-nokia-skullcandy-philips-brand",
                                                                                                "https://www.smartprix.com/mobile_headphones/lenovo-aroma-blaupunkt-nubia-syska-unix-bose-huawei-jabra-kdm-oraimo-ambrane-hoppup-itel-vivo-edifier-brand",
                                                                                                 "https://www.smartprix.com/mobile_headphones/audio_technica-crossbeats-govo-croma-motorola-infinity-intex-foxin-gionee-brand"]
    const scrapedDataArray = [];
    console.log(categories.length + " " + categories_url.length)
    for (let x = 0; x < 6; x++) {
        const scrapedData = await scrapeDataFromURL(categories_url[x], categories[x]);
        console.log(scrapedData)
        for (var k = 0; k < scrapedData.length; k++) {
            var new_electrical = new ELECTRICALNEWVU({
                item_name: scrapedData[k].item_name,
                item_IMG: scrapedData[k].item_IMG,
                // item_specs:scrapedData[k].item_specs,
                category: scrapedData[k].category,
                category_main: scrapedData[k].category_main
            })
            new_electrical.save().then(function (err, savedelectrical) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(savedelectrical)
                }
            })
        }
        scrapedDataArray.push(scrapedData);
    }

    return scrapedDataArray.flat(); // Flatten the array of arrays
}

app.get("/admin_flush_n_up", async (req, res) => {
    const final_array = await big();
    res.json(final_array);



    // for (var k = 0; k < final_array.length; k++) {
    //     var new_electrical = new ELECTRICALNEWVU({
    //         item_name: final_array[k].item_name,
    //         item_IMG:final_array[k].item_IMG,
    //         // item_specs:final_array[k].item_specs,
    //         category: final_array[k].category,
    //         category_main: final_array[k].category_main
    //     })
    //     new_electrical.save().then(function (err, savedelectrical) {
    //         if (err) {
    //             console.log(err)
    //         } else {
    //             console.log(savedelectrical)
    //         }
    //     })
    // }
});



mongoose.connect('mongodb+srv://walkupwagon:walkup_up_wagon%40MK123@cluster0.uc34gsl.mongodb.net/MEDS', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("database connected!!!!");
});

app.listen(process.env.PORT || 3000, (err) => {
    console.log("Server is Running");
});