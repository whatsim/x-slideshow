(function (){

	var animate = (function (){
		var animationDictionary = []
		function byProperty(el,prop,endVal,t){
			
			t = t ? t : 500
			
			var startVal = el[prop]
			var dif = endVal - startVal
			var startTime = window.performance.now()

			if(Math.abs(dif) > 3){
				cancel(el.id)
				animationDictionary[el.id] = window.requestAnimationFrame(doScroll)
			}
			
			function doScroll(currentTime){
				var delta = (currentTime - startTime)/t
				var eased = delta - 1
				el[prop] = startVal + dif * (1+eased*eased*eased) //cubic out
				if(delta < 1) window.requestAnimationFrame(doScroll)
			}
		}
		function cancel(id){
			window.cancelAnimationFrame(animationDictionary[id])
		}
		return {
			byProperty : byProperty,
			cancel : cancel
		}
	})()

	var pictureProto = Object.create(HTMLDivElement.prototype, {
		imgs : {
			value : undefined,
			writable: true
		},
		styles : {
			value : undefined,
			writable: true
		},
		shadow : {
			value : undefined,
			writable: true
		},
		div : {
			value : undefined,
			writable: true
		},
		createdCallback: {
			value: function() {
				this.shadow = this.createShadowRoot()
				this.styles = document.createElement('style')
				this.div = document.createElement('div')
				this.shadow.appendChild(this.div)
				this.imgs = []
				this.shadow.appendChild(this.styles)
				this.populate(this.getAttribute('src'))
				this.styles.innerText = ":host { height: "+this.getAttribute('slide-height')+"; width:"+this.getAttribute('slide-width')+";display: block; overflow:hidden } div { white-space:nowrap; }"
				var self = this
				setTimeout(function(){
					self.styles.innerText += "img { margin:0 "+self.clientWidth/2+"px; display: inline-block; }"
				},0)
			}
		},
		attributeChangedCallback : {
			value : function(attrName, oldVal, newVal){
				switch(attrName) {
					case 'src' : 
						this.populate(newVal)
					break;
					case 'index' :
						var i = newVal/1
						i = i > this.imgs.length - 1 ? this.imgs.length - 1 : i
						i = i < 0 ? 0 : i
						if(this.imgs[i]) animate.byProperty(this,'scrollLeft',(this.imgs[i].offsetLeft-this.offsetLeft) - this.clientWidth/2 + this.imgs[i].clientWidth/2)
						if(i != newVal) this.setAttribute('index',i)
					break;
					case 'slide-width' :
						this.style.width = newVal
						this.shadow.styleSheets[0].rules[2].style.margin = "0 "+this.clientWidth/2 + "px";
						for(var i = 0; i < this.imgs.length; i++) setSize(this.imgs[i],this.clientWidth,this.clientHeight)
					break;
					case 'slide-height' :
						this.style.height = newVal
						this.shadow.styleSheets[0].rules[2].style.margin = "0 "+this.clientWidth/2 + "px";
						for(var i = 0; i < this.imgs.length; i++) setSize(this.imgs[i],this.clientWidth,this.clientHeight)
					break;
				}

			}
		},
	    next : {
			value: function(){
				var i = this.getAttribute('index')
				if(isNaN(i)) i = 0
	    		i ++
	    		i %= this.imgs.length
	    		this.setAttribute('index',i)
	    	}
	    },
	    previous : {
	    	value: function(){
		    	var i = this.getAttribute('index')
				if(isNaN(i)) i = 0
				i --
		    	i += this.imgs.length
		    	i %= this.imgs.length
		    	this.setAttribute('index',i)
		    }
		},
		populate : {
			value : function(val){
				this.urls = val
				this.imgs.length = 0
				this.div.innerHTML = ""
				var url = val.split(',')
				for(var i = 0; i < url.length; i++){
					this.imgs[i] = document.createElement('img')
					this.imgs[i].src = url[i].trim()
					this.imgs[i].index = i + ""
					var self = this
					var index = self.getAttribute('index')
					index = index ? index : "0"
					this.imgs[i].addEventListener('load',function(){
						setSize(this,self.clientWidth,self.clientHeight)
						if(index == this.index) self.scrollLeft = (self.imgs[index/1].offsetLeft-self.offsetLeft) - self.clientWidth/2 + self.imgs[index/1].clientWidth/2
					})
					this.div.appendChild(this.imgs[i]);
				}
				var self = this
			}
		}
	});
	function setSize(el,width,height){
		if(el.clientHeight/el.clientWidth > height/width){
			el.width = height * (el.clientWidth/el.clientHeight)
		} else {
			el.width = width
		}
		el.style.marginBottom = (height - el.clientHeight)/2 + "px"
	}
	document.registerElement('x-slideshow', {prototype: pictureProto});
})()