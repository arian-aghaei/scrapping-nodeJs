const axios = require('axios');
const fs = require('fs');

const searchData = {
	"city_ids": [
		"1"
	],
	"pagination_data": {
		"@type": "type.googleapis.com/post_list.PaginationData",
		"last_post_date": "2024-07-14T10:15:14.732097Z",
		"page": 1,
		"layer_page": 1
	},
	"search_data": {
		"form_data": {
			"data": {
				"category": {
					"str": {
						"value": "ROOT"
					}
				}
			}
		}
	}
};

async function collectAdvertise(data) {
	return axios.post('https://api.divar.ir/v8/postlist/w/search', data)
		.then(response => {
			return response.data
		})
		.catch(res => {
			console.log(res.response)
		});
}

(async function () {
	let advertises = [];

	for (let i = 0; i < 40; i++) {
		await collectAdvertise({
			...searchData, ...{
				pagination_data: {
					...searchData.pagination_data,
					page: i,
					layer_page: i
				}
			}
		}).then(res => {
			res.list_widgets.forEach(ads => {
				// console.log(ads.data.action.payload)
				advertises.push({
					token: ads.data.action.payload.token,
					title: ads.data.title,
					image: ads.data.image_url,
					price: ads.data.middle_description_text,
					url: 'https://divar.ir/v/' + ads.data.action.payload.token,
					chat: (ads.data.has_chat)??false,
				})
			})
		});
	}

	fs.writeFileSync('advertise.json',JSON.stringify(advertises),{encoding: "utf-8"})
})();
