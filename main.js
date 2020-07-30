// @ts-nocheck

// Credits: https://codepen.io/scottkellum/pen/WqwjLm
(() => {
	function getPureProperty(rule, propertyName) {
		const raw = rule.style.getPropertyValue(propertyName);
		return raw.trim().slice(1, -1);
	}

	function cjss(rules) {
		for (let rule of rules) {
			const ruleName = rule.constructor.name;

			if (ruleName === 'CSSImportRule') {
				const importedRules = rule.styleSheet.cssRules;
				cjss(importedRules);
			} else if (ruleName === 'CSSStyleRule') {
				const selector = rule.style.parentRule.selectorText;
				const elements = document.querySelectorAll(selector);

				let js = getPureProperty(rule, '--js');
				let html = getPureProperty(rule, '--html');
				let data = getPureProperty(rule, '--data');

				if (data) {
					data = eval(`({ ${data} })`);
				}

				if (html) {
					for (let element of elements) {
						element.innerHTML = eval(`\`${html}\``);
					}
				}

				if (js) {
					if (selector === 'script') {
						eval(js);
						continue;
					}

					for (let n = 0; n < elements.length; n++) {
						eval(js.replace(/this/g, `document.querySelectorAll('${selector}')[${n}]`));
					}
				}
			}
		}
	}

	function initialize() {
		for (let sheet of document.styleSheets) {
			const rules = sheet.rules || sheet.cssRules;

			if (!rules || !rules.length) continue;

			cjss(rules);
		}
	}

	initialize();

	window.dataLayer = window.dataLayer || [];

	function gtag() {
		dataLayer.push(arguments);
	}

	gtag('js', new Date());

	gtag('config', 'UA-83446952-2');
})();
