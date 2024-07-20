const axios = require('axios');
const fs = require('fs');

let data = fs.readFileSync('./advertise.json', { encoding: 'utf8', flag: 'r' });
data = JSON.parse(data)

let result = [];
let i = 0;
// data = data.map(item => {
//     if (i <= 1) {
//         i += 1;
//         let imgLink = [];
//         collectAdvertise(item.token).then(res => {
//             imgLink = imgGrabber(res)
//             item = {
//                 ...item, ...{
//                     image: imgLink,
//                 }
//             }
//             console.log("item : ",item);
//             result.push(item);
//             fs.writeFileSync('ads2.json',JSON.stringify(result),{encoding: "utf-8"})
//         })
//         // console.log("item : ",item);
//
//     }
// });

(async function () {
    for (let item of data){
        // if(i >= 10 && i <= 100){
        //     i += 1;
        //     let imgLink = [];
        //     let res = await collectAdvertise(item.token);
        //     const Tag = tag(res);
        //     if(Tag == 'خدمات'){
        //         imgLink = imgGrabber(res);
        //         item = {
        //             ...item, ...{
        //                 image: imgLink,
        //             }
        //         }
        //         result.push(item);
        //
        //     }
        //     await new Promise(resolve => setTimeout(resolve, 600))
        //
        //
        //     // console.log(result)
        // }
        // else
        //     i += 1;

        let imgLink = [];
        let res = await collectAdvertise(item.token);
        const Tag = tag(res);
        if(Tag == 'سواری'){
            imgLink = imgGrabber(res);
            item = {
                ...item, ...{
                    image: imgLink,
                }
            }
            result.push(item);
        }

        await new Promise(resolve => setTimeout(resolve, 600))
    }
    fs.writeFileSync('ads2.json',JSON.stringify(result),{encoding: "utf-8"});
})();


function tag(res){
    let list = [];
    let sec = res.sections;
    sec = sec.filter(item => item.section_name == 'TAGS');
    if(sec.length){
        sec = sec[0].widgets;
        let items = [];
        sec.forEach(item => items.push(item.data.chip_list.chips));
        return items[0][0].text.split(' ')[0];
    }
    else
        return null;
}


function imgGrabber(res){
    let list = []
    // console.log(res);
    let sec = res.sections;
    // console.log(sec);
    sec = sec.filter(item => item.section_name == 'IMAGE');
    if(sec.length){
        sec = sec[0].widgets;
        // console.log(sec);
        let items = [];
        sec.forEach(item => items.push(item.data.items));
        let items2 = []
        items.forEach(item => {
            item.forEach(obj => items2.push(obj))
        })
        // console.log(items2);
        items2.forEach(item => list.push(item.image.url));
        // console.log(list);
        return list;
    }
    else {
        return null;
    }
}

async function collectAdvertise(token) {
    return axios.get('https://api.divar.ir/v8/posts-v2/web/'+token)
        .then(response => {
            return response.data
        });
}

