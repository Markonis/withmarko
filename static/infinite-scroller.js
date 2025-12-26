class InfiniteScroller {
    constructor(parent, options) {
        this.parent = parent;
        this.options = options;
        this.elements = [];
        this.elementOffsets = [];
        this.scrollPosition = 0;
        for (const el of parent.children) {
            this.elements.push(el);
            this.elementOffsets.push(0);
        }
        this.gap = this.computeGap();
    }
    scroll(dist) {
        const parentRect = this.parent.getBoundingClientRect();
        const parentStart = this.getStart(parentRect);
        this.scrollPosition += dist;
        for (let index = 0; index < this.elements.length; index++) {
            this.moveElement(index, dist);
        }
        const sortedElements = this.getSortedElements();
        let maxEnd = this.getEnd(
            sortedElements[sortedElements.length - 1].rect,
        );
        for (const se of sortedElements) {
            if (this.getEnd(se.rect) < parentStart) {
                const start = this.getStart(se.rect);
                const end = this.getEnd(se.rect);
                this.moveElement(se.index, maxEnd - start + this.gap);
                maxEnd += end - start;
            }
        }
    }
    getSortedElements() {
        const result = this.elements.map((element, index) => {
            const rect = element.getBoundingClientRect();
            return { index, element, rect };
        });
        return result.sort((a, b) =>
            this.getStart(a.rect) - this.getStart(b.rect)
        );
    }
    scrollTo(position) {
        const dist = position - this.scrollPosition;
        this.scroll(dist);
    }
    reset() {
        this.scrollPosition = 0;
        this.gap = this.computeGap();
        this.elements.forEach((_, index) => {
            this.moveElement(index, -this.elementOffsets[index]);
        });
    }
    computeLoopDistance() {
        const parentRect = this.parent.getBoundingClientRect();
        const parentStart = this.getStart(parentRect);
        const max = this.computeMaxEnd();
        return max - parentStart + this.gap;
    }
    get isHorizontal() {
        return this.options.axis === "x";
    }
    computeMaxEnd() {
        let max = 0;
        for (const element of this.elements) {
            const rect = element.getBoundingClientRect();
            const end = this.getEnd(rect);
            if (end > max) {
                max = end;
            }
        }
        return max;
    }
    computeGap() {
        if (!this.elements.length) {
            return 0;
        }
        const firstRect = this.elements[0].getBoundingClientRect();
        const secondRect = this.elements[1].getBoundingClientRect();
        return this.getStart(secondRect) - this.getEnd(firstRect);
    }
    getStart(rect) {
        if (this.isHorizontal) {
            return rect.left;
        } else {
            return rect.top;
        }
    }
    getEnd(rect) {
        if (this.isHorizontal) {
            return rect.right;
        } else {
            return rect.bottom;
        }
    }
    moveElement(index, dist) {
        this.elementOffsets[index] += dist;
        const offset = this.elementOffsets[index];
        if (this.isHorizontal) {
            this.elements[index].style.transform = `translateX(${offset}px)`;
        } else {
            this.elements[index].style.transform = `translateY(${offset}px)`;
        }
    }
}
export class HorizontalCarousel {
    constructor(parent, options) {
        this.options = options;
        this.scroller = new InfiniteScroller(parent, { axis: "x" });
        this.start();
    }
    start() {
        this.animate((dt) => {
            if (dt > 100) {
                this.scroller.reset();
            } else {
                this.scroller.scroll(-dt * this.options.speed);
            }
        });
    }
    animate(callback) {
        let last = -1;
        function cb(timestamp) {
            if (last > 0) {
                callback(timestamp - last);
            }
            last = timestamp;
            requestAnimationFrame(cb);
        }
        requestAnimationFrame(cb);
    }
}
