import countryForm from "../templates/countries.hbs";
import countriesFetch from "./fetch-country.js";
import debounce from "lodash";
import toastr from 'toastr';




const refs = {
	input: document.querySelector(".js-search-input"),
	output: document.querySelector(".js-response"),
	clearBtn: document.querySelector(".js-clear"),
}
let listOfLinks = null;

refs.input.addEventListener("input", debounce.debounce(makeRequest, 1000));
refs.clearBtn.addEventListener("click", clearAll);



function makeRequest() {
	refs.output.innerHTML = "";
	if (listOfLinks) { clearListener() };
	if (refs.input.value) {
		countriesFetch(refs.input.value).then(countries => {
			if (countries) {
				parseCountries(countries)
			}
			else {
				errorNotify('Found nothing, try differently!')
			}
		})
	};
}


function parseCountries(countries) {
	if (countries.length > 10) {
		errorNotify('Please enter a more specific query!');
	} else if (countries.length >= 2 && countries.length <= 10) {
		refs.output.insertAdjacentHTML("afterbegin", `<ul class="proposed-list">${countries.reduce((acc, { name }) => acc + `<li><a href="#">${name}</a></li>`, "")}</ul>`);
		listOfLinks = document.querySelector(".proposed-list");
		listOfLinks.addEventListener("click", showSelectedCountry);

	} else {
		refs.output.insertAdjacentHTML("afterbegin", countryForm(countries[0]));
	}
}


function showSelectedCountry(event) {
	const countryName = event.target.innerText;
	refs.input.value = countryName;
	refs.output.innerHTML = "";
	countriesFetch(countryName).then(countries => {
		const singleCountry = countries.filter(({ name }) => name.toLowerCase() === countryName.toLowerCase())[0];
		refs.output.insertAdjacentHTML("afterbegin", countryForm(singleCountry));
	})
	clearListener();
}

function clearListener() {
	listOfLinks.removeEventListener("click", showSelectedCountry);
	listOfLinks = null;
}

function clearAll() {
	refs.input.value = "";
	refs.output.innerHTML = "";
	if (listOfLinks) { clearListener() };
}


const errorNotify = str => toastr.error(str);



toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: true,
  positionClass: 'toast-top-right',
  preventDuplicates: true,
  onclick: null,
  showDuration: '5000',
  hideDuration: '300',
  timeOut: '1000',
  extendedTimeOut: '300',
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
};