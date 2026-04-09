// Utility Functions
const showLoader = (container) => {
    container.innerHTML = `<div class="loader"></div>`;
    container.classList.remove('placeholder');
};

const showError = (container, message) => {
    container.innerHTML = `<p class="error-text">❌ ${message}</p>`;
};

const showToast = (message) => {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
};

// 1. Dog Finder
let currentDogUrl = '';
const getDogBtn = document.getElementById('btn-get-dog');
const copyDogBtn = document.getElementById('btn-copy-dog');
const dogResult = document.getElementById('dog-result');

const fetchDog = async () => {
    try {
        showLoader(dogResult);
        copyDogBtn.classList.add('hidden');
        getDogBtn.disabled = true;

        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        if (!response.ok) throw new Error('Failed to fetch dog data');
        const data = await response.json();
        
        currentDogUrl = data.message;
        
        // Extract breed from URL
        // Example URL: https://images.dog.ceo/breeds/terrier-irish/n02093991_4404.jpg
        const urlParts = currentDogUrl.split('/');
        const breedIndex = urlParts.indexOf('breeds') + 1;
        let breedName = "Unknown Breed";
        if (breedIndex > 0 && breedIndex < urlParts.length) {
            breedName = urlParts[breedIndex].replace('-', ' ');
        }

        dogResult.innerHTML = `
            <img src="${currentDogUrl}" alt="Random Dog" class="dog-image">
            <span class="breed-badge">${breedName}</span>
        `;
        copyDogBtn.classList.remove('hidden');
    } catch (error) {
        showError(dogResult, error.message);
    } finally {
        getDogBtn.disabled = false;
    }
};

getDogBtn.addEventListener('click', fetchDog);
copyDogBtn.addEventListener('click', async () => {
    if (!currentDogUrl) return;
    try {
        await navigator.clipboard.writeText(currentDogUrl);
        showToast('Image URL copied to clipboard! 📋');
    } catch(err) {
        showToast('Failed to copy URL');
    }
});


// 2. Joke Generator
const getJokeBtn = document.getElementById('btn-get-joke');
const nextJokeBtn = document.getElementById('btn-next-joke');
const jokeResult = document.getElementById('joke-result');

const fetchJoke = async () => {
    try {
        showLoader(jokeResult);
        nextJokeBtn.classList.add('hidden');
        getJokeBtn.disabled = true;
        nextJokeBtn.disabled = true;

        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        if (!response.ok) throw new Error('Failed to fetch joke');
        const data = await response.json();

        jokeResult.innerHTML = `
            <p class="joke-setup">${data.setup}</p>
        `;
        
        // Add artificial delay for the punchline for comedic effect
        setTimeout(() => {
            const punchline = document.createElement('p');
            punchline.className = 'joke-punchline';
            punchline.textContent = data.punchline;
            jokeResult.appendChild(punchline);
            nextJokeBtn.classList.remove('hidden');
            getJokeBtn.classList.add('hidden');
            nextJokeBtn.disabled = false;
        }, 1500);

    } catch (error) {
        showError(jokeResult, error.message);
        getJokeBtn.disabled = false;
    }
};

getJokeBtn.addEventListener('click', fetchJoke);
nextJokeBtn.addEventListener('click', fetchJoke);


// 3. Random User Profile
const getUserBtn = document.getElementById('btn-get-user');
const userResult = document.getElementById('user-result');

const fetchUser = async () => {
    try {
        showLoader(userResult);
        getUserBtn.disabled = true;

        const response = await fetch('https://randomuser.me/api/');
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        const user = data.results[0];

        userResult.innerHTML = `
            <div class="user-profile">
                <img src="${user.picture.large}" alt="User Avatar" class="user-avatar">
                <h3 class="user-name">${user.name.first} ${user.name.last}</h3>
                <div class="user-details">
                    <p>📧 ${user.email}</p>
                    <p>🌍 ${user.location.country}</p>
                    <p>🎂 Age: ${user.dob.age}</p>
                    <p>📱 ${user.phone}</p>
                </div>
            </div>
        `;
    } catch (error) {
        showError(userResult, error.message);
    } finally {
        getUserBtn.disabled = false;
    }
};

getUserBtn.addEventListener('click', fetchUser);


// 4. Decision Maker
const getDecisionBtn = document.getElementById('btn-get-decision');
const decisionResult = document.getElementById('decision-result');

const fetchDecision = async () => {
    try {
        showLoader(decisionResult);
        getDecisionBtn.disabled = true;

        const response = await fetch('https://yesno.wtf/api');
        if (!response.ok) throw new Error('Failed to fetch decision');
        const data = await response.json();

        decisionResult.innerHTML = `
            <img src="${data.image}" alt="${data.answer}" class="dog-image">
            <span class="breed-badge" style="font-size: 1.5rem; text-transform: uppercase;">${data.answer}</span>
        `;
    } catch (error) {
        showError(decisionResult, error.message);
    } finally {
        getDecisionBtn.disabled = false;
    }
};

getDecisionBtn.addEventListener('click', fetchDecision);


// 5. Cat Facts
const getCatBtn = document.getElementById('btn-get-cat');
const catResult = document.getElementById('cat-result');

const fetchCatFact = async () => {
    try {
        showLoader(catResult);
        getCatBtn.disabled = true;

        const response = await fetch('https://catfact.ninja/fact');
        if (!response.ok) throw new Error('Failed to fetch cat fact');
        const data = await response.json();

        catResult.innerHTML = `
            <p class="joke-setup">🐾 ${data.fact}</p>
        `;
    } catch (error) {
        showError(catResult, error.message);
    } finally {
        getCatBtn.disabled = false;
    }
};

getCatBtn.addEventListener('click', fetchCatFact);


// 6. Advice Generator
const getAdviceBtn = document.getElementById('btn-get-advice');
const adviceResult = document.getElementById('advice-result');

const fetchAdvice = async () => {
    try {
        showLoader(adviceResult);
        getAdviceBtn.disabled = true;

        /* advice API is sometimes cached heavily, appending a timestamp helps get a random one */
        const timestamp = new Date().getTime();
        const response = await fetch(`https://api.adviceslip.com/advice?t=${timestamp}`);
        if (!response.ok) throw new Error('Failed to fetch advice');
        const data = await response.json();

        adviceResult.innerHTML = `
            <p class="joke-setup">"${data.slip.advice}"</p>
        `;
    } catch (error) {
        showError(adviceResult, error.message);
    } finally {
        getAdviceBtn.disabled = false;
    }
};

getAdviceBtn.addEventListener('click', fetchAdvice);
