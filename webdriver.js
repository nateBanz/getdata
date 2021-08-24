const chrome = require("selenium-webdriver/chrome");
const fs = require('fs');
const path = require('path')
let options = new chrome.Options()

options.addExtensions(encode(path.resolve(__dirname, 'C:/Users/nate/IdeaProjects/getdata/extension_4_32_0_0.crx')))


function encode(file) {
    let stream = fs.readFileSync(file);
    return new Buffer.from(stream).toString('base64');
}


const {WebElement} = require("selenium-webdriver");
const {Builder, By, Key, until} = require('selenium-webdriver');
let driver;
const firebase = require('firebase')
let lister = []


async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}

function initalize () {

    let firebaseConfig = {
        apiKey: "AIzaSyBifKFLyeb5Qm71HtCyJ7LnI7_ot8RPsvE",
        authDomain: "anubis-c9edb.firebaseapp.com",
        databaseURL: "https://anubis-c9edb-default-rtdb.firebaseio.com",
        projectId: "anubis-c9edb",
        storageBucket: "anubis-c9edb.appspot.com",
        messagingSenderId: "745868178409",
        appId: "1:745868178409:web:8e7e26aa3d73d2a5d8d178"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

async function firebaseStorage() {

    let nameList= [];

    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).
        build();
    //chrome.setDefaultService(new chrome.ServiceBuilder('/Users/natesmac/IdeaProjects/getdata/chromedriver').build());

    await driver.get('https://overwatch.op.gg/leaderboards?platform=pc&role_id=0&page=11');

    try {

        for(let i = 1; i<12; i++) {
            await sleep(500)
            let namer = await driver.findElements(By.css('#LeaderBoardsLayoutContent > table > tbody > tr:nth-child(n) > td.ContentCell.ContentCell-Player > a > b'))
            await sleep(500)
            console.log("found")
            //let foo = await driver.wait(until.elementLocated(By.id('foo')), 30000, 'Timed out after 30 seconds', 5000);
           // let namer = await driver.findElement(By.xpath('//*[@id="LeaderBoardsLayoutContent"]/table/tbody/tr[1]/td[3]'))
            console.log('got a list of names')
           // console.log(namer)
            //console.log(await namer[0].getText())

            //for(let i = 0; i< 100; i++) {

                //nameList.push(await namer[i].getText())
           // }

            //namer = await driver.findElements(By.css('#LeaderBoardsLayoutContent > table > tbody > tr:nth-child(n) > td.ContentCell.ContentCell-Player > a > b'))

            for(let element of namer) {
                nameList.push( await element.getText())
            }

            await sleep(500)
            //click the next button
           await driver.get(`https://overwatch.op.gg/leaderboards?platform=pc&role_id=0&page=${11+(i*7)}`)



            console.log(await driver.getCurrentUrl())




            //#LeaderBoardsLayoutContent > table > tbody > tr:nth-child(2) > td.ContentCell.ContentCell-Player > a > b


        }
        await sleep(2000)
        console.log(nameList)
        return nameList;

    } catch (e) {

        console.log(e)
    }
    finally {
        await driver.quit()
    }
}

async function getTags(list) {

    //let chrome = require("selenium-webdriver/chrome");

{
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options)
        .build();
    //chrome.setDefaultService(new chrome.ServiceBuilder('/Users/natesmac/IdeaProjects/getdata/chromedriver').build());
    let iterations = list.length - 1;
    await driver.get('https://www.overbuff.com/search');
    let searchbar, button, tag = new WebElement

    try {
        while (iterations >= 0) {
            await sleep(200)
            searchbar = await driver.findElement(By.css('body > div > div.container.main > div.row.layout-content > div > div:nth-child(3) > div > div.layout-header > div:nth-child(2) > div > form > input'))
            await sleep(200)
            await searchbar.clear()
            await sleep(200)
            console.log('cleared')
            await searchbar.sendKeys(list[iterations])
            console.log('sentkeys')
            await sleep(200)
            button = await driver.findElement(By.css('body > div > div.container.main > div.row.layout-content > div > div:nth-child(3) > div > div.layout-header > div:nth-child(2) > div > form > button'))
            await button.click()
            await sleep(3000)
            //await driver.wait(until.elementLocated(By.id('foo')), 30000, 'Timed out after 30 seconds', 5000);
            //let tagger = await driver.wait(until.elementsLocated(By.css('body > div > div.container.main > div.row.layout-content > div > div:nth-child(n) > div > div.search-results > a > div.result-bio > div.player-name > div > h2')), 30000, 'timed out after 30s', 2500)

            let tagger = await driver.findElements(By.css('body > div > div.container.main > div.row.layout-content > div > div:nth-child(n) > div > div.search-results > a > div.result-bio > div.player-name > div > h2'))

             tagger = await driver.findElements(By.css('body > div > div.container.main > div.row.layout-content > div > div:nth-child(n) > div > div.search-results > a > div.result-bio > div.player-name > div > h2'))


            //tag = await  tag.getText()
            console.log(tagger)
            for (let tag of tagger) {


                tag = await tag.getText()
                console.log(tag)
                if (tag.includes('#')) {
                    firebase.database().ref().child("battleTagsforBadPlayers").push(tag);
                }
            }


            // list[iterations] = list[iterations] + '-' + tag
            // console.log(list[iterations])


            iterations--
        }


    } catch (e) {
        console.log(e)


        console.log("couldnt find the name so its time to skip")
        //list.splice(iterations,1)

        iterations--

        list.length = iterations
        console.log(list)

        await getTags(list)
    }

}
}
async function runner () {
    initalize()
    let listOfNames = await firebaseStorage();
    console.log(listOfNames)
    getTags(listOfNames).then(()=>(console.log(lister)));




   //firebase.database().ref().child("battleTags").push("hello");




    //get or create a reference to the germs child/object in the database
    //const battleTags = battlebase.child("battleTags");




    //battleTags.push(lister)
    //battleTags.push("cat2")

    //sleep(10000).then(process.exit())
    //process.exit()

}



runner().then(r => console.log(r));




