// Default preferences
const DEFAULT_LIST_PREFERENCES = {
	moviePopular: true,
	movieTopRated: true,
	movieTrending: true,
	movieUpcoming: false,
	movieNowPlaying: false,
	tvPopular: true,
	tvTopRated: true,
	tvTrending: true,
	tvAiringToday: false,
	tvOnAir: false,
	movieAction: false,
	movieComedy: false,
	movieDrama: false,
	movieHorror: false,
	movieRomance: false,
	movieThriller: false,
	movieScifi: false,
	movieFantasy: false,
	movieAnimation: false,
	movieDocumentary: false,
	tvAction: false,
	tvComedy: false,
	tvDrama: false,
	tvCrime: false,
	tvReality: false,
	tvAnimation: false,
	tvDocumentary: false,
	movieUs: false,
	movieUk: false,
	movieFrench: false,
	movieKorean: false,
	movieJapanese: false,
	tvUs: false,
	tvUk: false,
	tvFrench: false,
	tvKorean: false,
	tvJapanese: false,
};

// Initialize collapsible functionality
function initCollapsibles() {
	const collapsibles = document.querySelectorAll(".collapsible");

	collapsibles.forEach(function (collapsible) {
		collapsible.addEventListener("click", function () {
			// Toggle active class
			this.classList.toggle("active");

			// Get the content div
			const content = this.nextElementSibling;

			if (content && content.classList.contains("content")) {
				// Toggle show class
				content.classList.toggle("show");
			}
		});
	});
}

// Load current settings
function loadSettings() {
	if (typeof chrome !== "undefined" && chrome.storage) {
		chrome.storage.sync.get(["tmdbApiKey", "omdbApiKey", "listPreferences"], function (result) {
			// Load API keys
			const tmdbInput = document.getElementById("tmdb-key");
			const omdbInput = document.getElementById("omdb-key");

			if (tmdbInput) tmdbInput.value = result.tmdbApiKey || "";
			if (omdbInput) omdbInput.value = result.omdbApiKey || "";

			// Load preferences
			const preferences = result.listPreferences || DEFAULT_LIST_PREFERENCES;

			// Set all checkboxes
			Object.keys(preferences).forEach(function (key) {
				const checkbox = document.getElementById(key);
				if (checkbox) {
					checkbox.checked = preferences[key];
				}
			});
		});
	} else {
		console.error("Chrome storage not available");
	}
}

// Save settings
function saveSettings() {
	const tmdbKey = document.getElementById("tmdb-key").value.trim();
	const omdbKey = document.getElementById("omdb-key").value.trim();

	// Collect all checkbox preferences
	const listPreferences = {};
	Object.keys(DEFAULT_LIST_PREFERENCES).forEach(function (key) {
		const checkbox = document.getElementById(key);
		if (checkbox) {
			listPreferences[key] = checkbox.checked;
		}
	});

	if (typeof chrome !== "undefined" && chrome.storage) {
		chrome.storage.sync.set(
			{
				tmdbApiKey: tmdbKey,
				omdbApiKey: omdbKey,
				listPreferences: listPreferences,
			},
			function () {
				if (chrome.runtime.lastError) {
					console.error("Save error:", chrome.runtime.lastError);
					showStatus("Error saving settings: " + chrome.runtime.lastError.message, "error");
				} else {
					showStatus("Settings saved successfully!", "success");
				}
			}
		);
	} else {
		showStatus("Chrome storage not available", "error");
	}
}

// Reset settings
function resetSettings() {
	if (typeof chrome !== "undefined" && chrome.storage) {
		chrome.storage.sync.clear(function () {
			if (chrome.runtime.lastError) {
				console.error("Reset error:", chrome.runtime.lastError);
				showStatus("Error resetting settings: " + chrome.runtime.lastError.message, "error");
			} else {
				// Reset API keys
				document.getElementById("tmdb-key").value = "";
				document.getElementById("omdb-key").value = "";

				// Reset all checkboxes to defaults
				Object.keys(DEFAULT_LIST_PREFERENCES).forEach(function (key) {
					const checkbox = document.getElementById(key);
					if (checkbox) {
						checkbox.checked = DEFAULT_LIST_PREFERENCES[key];
					}
				});

				showStatus("Settings reset successfully!", "success");
			}
		});
	} else {
		showStatus("Chrome storage not available", "error");
	}
}

// Show status message
function showStatus(message, type) {
	const statusDiv = document.getElementById("status");
	if (statusDiv) {
		statusDiv.textContent = message;
		statusDiv.className = "status " + type;

		// Hide after 3 seconds
		setTimeout(function () {
			statusDiv.style.display = "none";
		}, 3000);
	}
}

// Initialize everything
function init() {
	initCollapsibles();
	loadSettings();

	// Add event listeners for buttons
	const saveBtn = document.getElementById("save-btn");
	const resetBtn = document.getElementById("reset-btn");

	if (saveBtn) {
		saveBtn.addEventListener("click", saveSettings);
	}

	if (resetBtn) {
		resetBtn.addEventListener("click", resetSettings);
	}
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
