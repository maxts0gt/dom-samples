// create base url, it's called base since it's a base
const API_BASE_URL = 'URL';
// and other parameters
const PAGE_SIZE = 5;

let canFetchTestimonials = true;
let afterID = null;

// grabbing the testimonal container div
const testimonialContainer = document.getElementById('testimonial-container');

// call event listener on it
testimonialContainer.addEventListener('scroll', handleScroll);

function handleScroll() {
	// check if there is testimonials left
	if (!canFetchTestimonials) return;
	// calculating bottom space
	const bottomSpaceLeftToScroll =
		this.scrollHeight - this.scrollTop - this.clientHeight;
	// if not space left then return
	if (bottomSpaceLeftToScroll > 0) return;
	// if not keep fetch and appending
	fetchAndAppendTestimonials();
}

fetchAndAppendTestimonials();

// this is where main logic goes
async function fetchAndAppendTestimonials() {
	canFetchTestimonials = false;
	const url = createTestimonialsURL();
	const response = await fetch(url);
	// destructure the info from response
	const { testimonials, hasNext } = await response.json();
	const fragment = document.createDocumentFragment();
	//go through the array and calling create DOM element and appending to the fragment
	testimonials.forEach(({ message }) => {
		fragment.appendChild(createTestimonialElement(message));
	});
	// appending container the fragment after the for each loop
	testimonialContainer.appendChild(fragment);

	if (hasNext) {
		afterID = testimonials[testimonials.length - 1].id;
	} else {
		testimonialContainer.removeEventListener('scroll', handleScroll);
	}

	canFetchTestimonials = true;
}

// this is response putting out to the DOM
function createTestimonialElement(message) {
	const testimonialElement = document.createElement('p');
	testimonialElement.classList.add('testimonial');
	testimonialElement.textContent = message;
	return testimonialElement;
}

// this is API specific setting
function createTestimonialsURL() {
	// call the base url here
	const url = new URL(API_BASE_URL);
	// set parameters on base url (using url as an object)
	url.searchParams.set('limit', PAGE_SIZE);
	// here checking the there is after ID
	if (afterID !== null) {
		// if there is then set the value on 'after'
		url.searchParams.set('after', afterID);
	}
	// and return the URL
	return url;
}
