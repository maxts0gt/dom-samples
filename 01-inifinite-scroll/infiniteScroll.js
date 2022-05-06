// create base url, it's called base since it's a base
const API_BASE_URL = 'https://www.algoexpert.io/api/testimonials';
// and other parameters
const PAGE_SIZE = 5;

let canFetchTestimonials = true;
let afterID = null;

const testimonialContainer = document.getElementById('testimonial-container');

testimonialContainer.addEventListener('scroll', handleScroll);

function handleScroll() {
	if (!canFetchTestimonials) return;
	const bottomSpaceLeftToScroll =
		this.scrollHeight - this.scrollTop - this.clientHeight;

	if (bottomSpaceLeftToScroll > 0) return;

	fetchAndAppendTestimonials();
}

fetchAndAppendTestimonials();

async function fetchAndAppendTestimonials() {
	canFetchTestimonials = false;
	const url = createTestimonialsURL();
	const response = await fetch(url);
	const { testimonials, hasNext } = await response.json();
	const fragment = document.createDocumentFragment();
	testimonials.forEach(({ message }) => {
		fragment.appendChild(createTestimonialElement(message));
	});
	testimonialContainer.appendChild(fragment);

	if (hasNext) {
		afterID = testimonials[testimonials.length - 1].id;
	} else {
		testimonialContainer.removeEventListener('scroll', handleScroll);
	}

	canFetchTestimonials = true;
}

function createTestimonialElement(message) {
	const testimonialElement = document.createElement('p');
	testimonialElement.classList.add('testimonial');
	testimonialElement.textContent = message;
	return testimonialElement;
}

function createTestimonialsURL() {
	// call the base url here
	const url = new URL(API_BASE_URL);
	// set parameters on base url (using url as an object)
	url.searchParams.set('limit', PAGE_SIZE);

	if (afterID !== null) {
		url.searchParams.set('after', afterID);
	}

	return url;
}
