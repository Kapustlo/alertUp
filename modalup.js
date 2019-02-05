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
	constructor(type = 'alert', showStyle = 'fade') {
		super();
		this.showStyle = showStyle; 
		this.type = type;
		this.fadeOutTime = 400;
		this.fadeInTime = 400;
		this.appearTime = 800; // For "slide"
		this.disappearTime = 800; // For "slide"
		this.popUpTime = 1000;
		this.popOutTime = 200;
		let className;
		if (type == 'alert') {
			className = 'modalup-container modalup-centered';
		} else if(type == 'modal') {
			className = 'modalup-container modalup-centered modalup-container-fluid';
		}
		this.container = {
			'tag': 'div',
			'className': className
		}
		this.containerElement;
		this.containerCreated = false;
	}

	popUp(element, time = this.popUpTime, size) {
		let counter = (size.width + size.height) / time * 2;
		let interval = setInterval(function(){
			let transform = Number(element.style.transform.replace('scale(','').replace(')',''));
			console.log(transform);
			if (transform < 1) {
				let val = transform + 0.01;
				element.style.transform = `scale(${val})`;
			} else {
				clearInterval(interval);
			}
		}, counter);
	}

	popOut(element,time = this.popOutTime, size) {
		let counter = (size.width + size.height) / time * 2;
		let interval = setInterval(function(){
			let transform = Number(element.style.transform.replace('scale(','').replace(')',''));
			console.log(transform);
			if (transform > 0) {
				let val = transform - 0.01;
				element.style.transform = `scale(${val})`;
			} else {
				clearInterval(interval);
			}
		}, counter);
	}

	fadeIn(element, time = this.fadeInTime) {
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
    },time * counter);
	}

	fadeOut(element, time = this.fadeOutTime)  {
		let counter = 0.01; 
		let interval = setInterval(function () {
        if (element.style.opacity > 0) {
            element.style.opacity = Number(element.style.opacity) - counter;
        } else {
            clearInterval(interval);
        }
    },time * counter);
	}


	slideIn(element, time = this.appearTime) {
		let counter = (150 / time) * 4 ;
		let interval = setInterval( () => {
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

	slideOut(element, time = this.disappearTime) {
		let counter = (-150 / time) * 4;
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

	getCloseTime(showStyle) {
		if (showStyle == 'fade') {
			return this.fadeOutTime;
		} else if(showStyle == 'slide') {
			return this.disappearTime;
		} else if(showStyle == 'popup') {
			return this.popOutTime;
		} 
	}

	closeModal() {
		let time = getCloseTime(this.showStyle);
		if (this.showStyle == "fade") {
			this.fadeOut(this.modalWindow);
		} else if(this.showStyle == "slide") {
			this.slideOut(this.modalWindow);
		} else if(this.showStyle == "popup") {
			let width = this.modalWindow.offsetWidth;
			let height = this.modalWindow.offsetHeight;
			let size = {
				width: width,
				height: height
			};
			this.popOut(this.modalWindow,this.popOutTime,size);
		}
		setTimeout( () => {
			this.containerElement.remove();
			this.containerCreated = false;
		},time + 1);
	}

	create(properties) {
		// Creating modal container if it's not yet
		if (this.containerCreated === false) {
			this.containerElement = this.build(this.container);
			this.containerCreated = true;
		}

		let modalWindow = this.modalWindow(this.containerElement);

		this.modalWindow = modalWindow;

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
					break;
				case "timer":
					this.timer = properties[property];
					break;
			}
		}

		if (this.showStyle == "fade") {
			modalWindow.style.opacity = 0;
			this.fadeIn(modalWindow);
		} else if(this.showStyle == "slide") {
			modalWindow.style.transform = 'translateY(-150%)';
			this.slideIn(modalWindow);
		} else {
			let width = this.modalWindow.offsetWidth;
			let height = this.modalWindow.offsetHeight;
			this.modalWindow.style.transform = 'scale(0.5)';
			this.popUp(this.modalWindow,800,{width: width, height: height});
		}
		let closeBtn = modalWindow.getElementsByClassName('modalup-close')[0];

		if(typeof this.timer != 'undefined') setTimeout(() => {this.closeModal();},this.timer);

		closeBtn.onclick = () => {
			closeBtn.onclick = null;
			this.closeModal(modalWindow);
		}
		return modalWindow;
	}
}