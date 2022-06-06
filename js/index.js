const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1'
});
console.log(api.defaults);
api.defaults.headers.common['x-api-key'] = 'c9ab566f-6c71-45a8-8676-2850a8d8f02c';
const API_URL_RANDOM = '/images/search';
const API_URL_FAVOURITES = '/favourites';
const API_URL_FAVOURITES_DELETE = (id) => `/${id}`;
const API_URL_UPLOAD = '/images/upload';
const SPAN_ERROR = document.getElementById('error');

async function loadRandomMiaus() {
    try {
        const { data, status } = await api.get(`${API_URL_RANDOM}?limit=2`);
        if (status !== 200) {
            SPAN_ERROR.innerHTML = "Hubo un error: " + status;
        } else {
            console.log(data);
            const img1 = document.getElementById('img1');
            const img2 = document.getElementById('img2');
            const btn1 = document.getElementById('btn1');
            const btn2 = document.getElementById('btn2');

            img1.src = data[0].url;
            img2.src = data[1].url;

            btn1.onclick = () => saveFavouriteMiau(data[0].id);
            btn2.onclick = () => saveFavouriteMiau(data[1].id);
        }
    } catch (error) {
        console.log(error)
    }
}

async function loadFavouritesMiaus() {
    try {
        const { data, status } = await api.get(API_URL_FAVOURITES);
        console.log(data);
        if (status !== 200) {
            SPAN_ERROR.innerHTML = "Hubo un error: " + status + data.message;
        } else {
            const section = document.getElementById('favouriteMiaus');
            section.innerHTML = "";
            const h2 = document.createElement('h2');
            const h2Text = document.createTextNode('❤️ Favourites Miau Miaus ❤️');
            h2.appendChild(h2Text);
            section.appendChild(h2);

            data.forEach(miau => {
                const article = document.createElement('article');
                const img = document.createElement('img');
                const btn = document.createElement('button');
                const btnText = document.createTextNode('Quitar Miau');
                section.appendChild(article);
                article.appendChild(img);
                article.appendChild(btn);
                btn.appendChild(btnText);
                btn.onclick = () => deleteFavouriteMiau(miau.id);
                img.src = miau.image.url;
            });
        }
    } catch (error) {
        console.log(error)
    }
}

async function saveFavouriteMiau(id) {
    try {
        const { data, status } = await api.post(API_URL_FAVOURITES, {
            image_id: id
        });
        if (status !== 200) {
            SPAN_ERROR.innerHTML = "Hubo un error: " + status + data.message;
        } else {
            console.log('Miau miau guardado en favorito');
            loadFavouritesMiaus();
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteFavouriteMiau(id) {
    try {
        const { data, status } = await api.delete(API_URL_FAVOURITES + API_URL_FAVOURITES_DELETE(id));
        console.log(data);
        if (status !== 200) {
            SPAN_ERROR.innerHTML = "Hubo un error: " + status + data.message;
        } else {
            console.log('Miau miau eliminado');
            loadFavouritesMiaus();
        }
    } catch (error) {
        console.log(error);
    }
}

async function uploadMiau() {
    try {
        const form = document.getElementById('uploadForm');
        const formData = new FormData(form);
        const { data, status } = await api.post(API_URL_UPLOAD, formData)
        console.log(data);
        if (status !== 200) {
            SPAN_ERROR.innerHTML = "Hubo un error: " + status + data.message;
        } else {
            console.log('Miau miau subido');
            saveFavouriteMiau();
        }
    } catch (error) {
        console.log(error);
        SPAN_ERROR.innerHTML = "Hubo un error: " + error;
    }
}

loadRandomMiaus();
loadFavouritesMiaus();