class Templates {
	// Add elements to DOM
	build(elementProps,block,where = 'append') {
		let tag = elementProps['tag'];
		let domElement = document.createElement(tag);
		// Adding properties to the element
		for (let prop in elementProps) {
			domElement[prop] = elementProps[prop];
		}
		if (typeof block === 'undefined') {
			document.body.prepend(domElement);
		} else {
			where == 'append' ? block.appendChild(domElement) : block.prepend(domElement);
		}
		domElement.style.opacity = 1;
		return domElement;
	}

	// Template for all modal windows
	modalWindow(container) {
		// The actual window
		let modalWindow = this.build({
			'tag': 'div',
			'className': 'modalup-window modalup-rounded'
		},container);

		let closeDiv = this.build({
			'tag': 'div',
			'className': 'modalup-close-line',
			'innerHTML': '<p><span class="modalup-close"></span></p>'
		},modalWindow);

		let mainDiv = this.build({
			'tag': 'div',
			'className': 'modalup-main-div'
		},modalWindow);

		let titleDiv = this.build({
			'tag': 'div',
			'className': 'modalup-title'
		},mainDiv);

		let contentDiv = this.build({
			'tag': 'div',
			'className': 'modalup-content'
		},mainDiv);

		let textDiv = this.build({
			'tag': 'div',
			'className': 'modalup-text',
		},mainDiv);

		return modalWindow;

	}
}

class modalUp extends Templates {
	constructor(showStyle = 'fade') {
		super();
		this.showStyle = showStyle; 
		this.fadeOutTime = 400;
		this.fadeInTime = 400;
		this.appearTime = 800; // For "slide"
		this.disappearTime = 800; // For "slide"
		this.container = {
			'tag': 'div',
			'className': 'modalup-container modalup-centered'
		}
		this.containerElement;
		this.containerCreated = false;
	}

	fadeIn(element) {
		let counter = 0.01; 
		let interval = setInterval(function () {
        if (element.style.opacity < 1) {
            element.style.opacity = Number(element.style.opacity) + counter;
        } else {
        		if(element.style.opacity > 0) {
        			element.style.opacity = 1;
        		}
            clearInterval(interval);
        }
    },this.fadeInTime * counter);
	}

	fadeOut(element)  {
		let counter = 0.01; 
		let interval = setInterval(function () {
        if (element.style.opacity > 0) {
            element.style.opacity = Number(element.style.opacity) - counter;
        } else {
            clearInterval(interval);
        }
    },this.fadeOutTime * counter);
	}


	slideIn(element) {
		let counter = (150 / this.appearTime) * 4 ;
		let interval = setInterval(function() {
			let position = element.style.transform.replace(`translateY`,' ').replace('(','').replace('%)','');
			position = Number(position) + counter;
			if (position <= 0) {
				element.style.transform = `translateY(${position}%)`;
			} else {
				position = 0;
				element.style.transform = `translateY(${position}%)`;
				clearInterval(interval);
			}

		}, 1);
	}

	slideOut(element) {
		let counter = (-150 / this.disappearTime) * 4;
		let interval = setInterval(function() {
			let position = element.style.transform.replace(`translateY`,' ').replace('(','').replace('%)','');
			position = Number(position) + counter;
			if (position >= -150) {
				element.style.transform = `translateY(${position}%)`;
			} else {
				position = -150;
				element.style.transform = `translateY(${position}%)`;
				clearInterval(interval);
			}

		}, 1);
	}

	closeModal() {
		this.containerElement.remove();
		this.containerCreated = false;
	}

	create(properties) {
		// Creating modal container if it's not yet
		if (this.containerCreated === false) {
			this.containerElement = this.build(this.container);
			this.containerCreated = true;
		}

		let modalWindow = this.modalWindow(this.containerElement);

		for (let property in properties) {
			let innerHTML = properties[property];
			let div = modalWindow.getElementsByClassName(`modalup-${property}`)[0];
			switch(property) {
				case "title": 
					this.build({
						'tag': 'h3',
						'innerHTML': innerHTML
					},div);
					break;
				case "text":
					this.build({
						'tag': 'p',
						'innerHTML': innerHTML
					},div); 
			}
		}

		let time;
		if (this.showStyle == "fade") {
			modalWindow.style.opacity = 0;
			this.fadeIn(modalWindow);
			time = this.fadeOutTime;
		} else if(this.showStyle == "slide") {
			modalWindow.style.transform = 'translateY(-150%)';
			this.slideIn(modalWindow);
			time = this.disappearTime;
		}
		let closeBtn = modalWindow.getElementsByClassName('modalup-close')[0];
		closeBtn.onclick = () => {
			closeBtn.onclick = null;
			if (this.showStyle == "fade") {
				this.fadeOut(modalWindow);
			} else if(this.showStyle == "slide") {
				this.slideOut(modalWindow);
			}
			setTimeout( () => {
				this.closeModal(modalWindow);
			},time + 1);
		}
		return modalWindow;
	}
}