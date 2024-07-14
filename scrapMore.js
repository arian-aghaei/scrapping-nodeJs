const axios = require('axios');
const fs = require('fs');

let data = fs.readFileSync('./advertise.json', { encoding: 'utf8', flag: 'r' });
data = JSON.parse(data)

let result = [];
let i = 0;
data = data.map(item => { // use for for it lol
    if (i == 0) {
        i += 1;
        let imgLink = [];
        collectAdvertise(item.token).then(res => {
            imgLink = imgGrabber(res)
            item = {
                ...item, ...{
                    image: imgLink,
                }
            }
            console.log("item : ",item);
            result.push(item);
        })
        console.log("item : ",item);

    }
});


function imgGrabber(res){
    let list = []
    let sec = res.sections;
    sec = sec.filter(item => item.section_name == 'IMAGE');
    sec = sec[0].widgets;
    console.log(sec);
    let items = [];
    sec.forEach(item => items.push(item.data.items));
    let items2 = []
    items.forEach(item => {
        item.forEach(obj => items2.push(obj))
    })
    console.log(items2);
    items2.forEach(item => list.push(item.image.url));
    console.log(list);
    return list;
}

async function collectAdvertise(token) {
    return axios.get('https://api.divar.ir/v8/posts-v2/web/'+token)
        .then(response => {
            return response.data
        });
}

