const hero = document.querySelector(".hero");
const navigation = document.querySelector(".site-nav");
const quoteElement = document.querySelector("#hero-quote");
const about = document.querySelector(".about");
const roleElement = document.querySelector("#typed-role");
const quotes = [
	"My code works. I have no idea why. Please don't ask it to explain itself.",
	"I don't need therapy. I just need my code to compile on the first try.",
	"There are 10 kinds of people: those who understand binary and those who don't.",
	"It works on my machine. My machine has excellent taste.",
	"Programming is 10% writing code and 90% wondering why it stopped working.",
];
const roles = [
	"Co-Founder of Angel Academy",
    "High School Teacher (Comp.Sci)",
	"Code Mentor & Instructor",
	"Web Designer & Developer",
	"Front-End Developer",
];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let previousQuote = "";
try {
	previousQuote = window.sessionStorage.getItem("heroQuote") ?? "";
} catch {
	previousQuote = "";
}

const availableQuotes = quotes.filter((quote) => quote !== previousQuote);
const selectedQuote = availableQuotes[Math.floor(Math.random() * availableQuotes.length)] ?? quotes[0];
quoteElement.textContent = selectedQuote;

try {
	window.sessionStorage.setItem("heroQuote", selectedQuote);
} catch {}

let scrollTicking = false;

	const updateScrollState = () => {
		navigation.classList.toggle("is-scrolled", window.scrollY > 32);
		if (!prefersReducedMotion) {
			const progress = Math.min(window.scrollY / (hero.offsetHeight * 0.9), 1);
		hero.style.opacity = String(1 - progress);
		hero.style.transform = `translateY(-${progress * 2}rem)`;
		}
		scrollTicking = false;
	};

const updateScroll = () => {
	if (!scrollTicking) {
		window.requestAnimationFrame(updateScrollState);
		scrollTicking = true;
	}
};

window.addEventListener("scroll", updateScroll, { passive: true });
updateScrollState();

const skillTabs = Array.from(document.querySelectorAll(".skill-tab"));
const skillItems = Array.from(document.querySelectorAll(".skill-item"));
const skillsPanel = document.querySelector("#skills-panel");

const selectSkillTab = (selectedTab, moveFocus = false) => {
	const category = selectedTab.dataset.category;

	skillTabs.forEach((tab) => {
		const isSelected = tab === selectedTab;
		tab.classList.toggle("is-active", isSelected);
		tab.setAttribute("aria-selected", String(isSelected));
		tab.tabIndex = isSelected ? 0 : -1;
	});

	skillsPanel.setAttribute("aria-labelledby", selectedTab.id);
	skillItems.forEach((item) => {
		item.hidden = category !== "all" && item.dataset.category !== category;
	});

	if (moveFocus) {
		selectedTab.focus();
	}
};

skillTabs.forEach((tab) => {
	tab.addEventListener("click", () => selectSkillTab(tab));
	tab.addEventListener("keydown", (event) => {
		const currentIndex = skillTabs.indexOf(tab);
		let nextIndex;

		if (event.key === "ArrowRight") {
			nextIndex = (currentIndex + 1) % skillTabs.length;
		} else if (event.key === "ArrowLeft") {
			nextIndex = (currentIndex - 1 + skillTabs.length) % skillTabs.length;
		} else if (event.key === "Home") {
			nextIndex = 0;
		} else if (event.key === "End") {
			nextIndex = skillTabs.length - 1;
		} else {
			return;
		}

		event.preventDefault();
		selectSkillTab(skillTabs[nextIndex], true);
	});
});

selectSkillTab(skillTabs.find((tab) => tab.getAttribute("aria-selected") === "true"));

const projectCards = Array.from(document.querySelectorAll(".project-card"));
const projectDialog = document.querySelector("#project-dialog");
const projectDialogImage = document.querySelector("#project-dialog-image");
const projectDialogLink = document.querySelector("#project-dialog-link");
const projectLinkNote = document.querySelector("#project-link-note");

projectCards.forEach((card) => {
	card.addEventListener("click", () => {
		projectDialog.querySelector("#project-dialog-title").textContent = card.dataset.title;
		projectDialog.querySelector("#project-dialog-description").textContent = card.dataset.description;
		projectDialog.querySelector("#project-dialog-software").textContent = card.dataset.software;
		projectDialog.querySelector("#project-dialog-language").textContent = card.dataset.language;
		projectDialogImage.src = card.dataset.image;
		projectDialogImage.alt = card.dataset.imageAlt;

		const hasProjectUrl = Boolean(card.dataset.url.trim());
		projectDialogLink.hidden = !hasProjectUrl;
		projectLinkNote.hidden = hasProjectUrl;
		if (hasProjectUrl) {
			projectDialogLink.href = card.dataset.url;
		}

		projectDialog.showModal();
	});
});

projectDialog.querySelector(".project-dialog-close").addEventListener("click", () => {
	projectDialog.close();
});

projectDialog.addEventListener("click", (event) => {
	if (event.target === projectDialog) {
		projectDialog.close();
	}
});

const typeText = (element, text, speed, onComplete) => {
	let index = 0;
	element.textContent = "";

	const typeNext = () => {
		if (index < text.length) {
			element.textContent += text[index];
			index += 1;
			window.setTimeout(typeNext, speed);
		} else if (onComplete) {
			onComplete();
		}
	};

	typeNext();
};

const showRole = (roleIndex) => {
	typeText(roleElement, roles[roleIndex], 65, () => {
		window.setTimeout(() => eraseRole(roleIndex), 1800);
	});
};

const eraseRole = (roleIndex) => {
	const currentRole = roleElement.textContent;
	if (currentRole.length > 0) {
		roleElement.textContent = currentRole.slice(0, -1);
		window.setTimeout(() => eraseRole(roleIndex), 35);
	} else {
		window.setTimeout(() => showRole((roleIndex + 1) % roles.length), 300);
	}
};

if ("IntersectionObserver" in window) {
	const aboutObserver = new IntersectionObserver((entries) => {
		if (entries.some((entry) => entry.isIntersecting)) {
			about.classList.add("is-visible");
			aboutObserver.disconnect();

			if (!prefersReducedMotion) {
				showRole(0);
			}
		}
	}, { threshold: 0.25 });

	aboutObserver.observe(about);
} else if (!prefersReducedMotion) {
	showRole(0);
}