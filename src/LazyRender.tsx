// This code was sourced from https://github.com/onefinestay/react-lazy-render
// And patched with changes from  https://github.com/BI/react-lazy-render
namespace Components {
    import React = __React;

    interface IProps {
        children: JSX.Element[];
        maxHeight: number;
        className?: string;
        itemPadding: number;
    }

    interface IState {
        childrenTop?: number;
        childrenBottom?: number;
        childrenToRender?: number;
        scrollTop?: number;
        height?: number;
        childHeight?: number;
    }

    export class LazyRender extends React.Component<IProps, IState> {
        private container: HTMLElement = null;
        private child0: HTMLElement = null;

        constructor(props: IProps) {
            super(props);
            this.state = {
                childrenTop: 0,
                childrenBottom: undefined,
                childrenToRender: 10,
                scrollTop: 0,
                height: props.maxHeight,
                childHeight: undefined
            };
        }

        componentWillReceiveProps(nextProps: IProps) {
            let childHeight = this.state.childHeight || 1;
            const childrenLength = React.Children.count(nextProps.children);

            if (!this.state.childHeight && this.getChildHeight) {
                childHeight = this.getChildHeight();
            }

            const height = getHeight(childrenLength, childHeight, nextProps.maxHeight);

            let numberOfItems = Math.ceil(height / childHeight);

            if (height === this.props.maxHeight) {
                numberOfItems += this.props.itemPadding;
            }

            let childrenTop = Math.floor(this.state.scrollTop / childHeight);

            // if children top is larger than the max item count, set it to the bottom
            childrenTop = Math.min(childrenTop, childrenLength - numberOfItems);
            childrenTop = Math.max(childrenTop, 0);

            let childrenBottom = (childrenLength - childrenTop - this.state.childrenToRender);

            childrenBottom = Math.max(childrenBottom, 0);

            this.setState({
                childrenTop: childrenTop,
                childrenBottom: childrenBottom,
                childrenToRender: numberOfItems,
                scrollTop: this.state.scrollTop,
                height: height,
                childHeight: childHeight
            });
        }
        
        componentDidMount() {
            const childHeight = this.getChildHeight();
            const childrenLength = React.Children.count(this.props.children);

            const height = getHeight(
                childrenLength,
                childHeight,
                this.props.maxHeight
            );

            let numberOfItems = Math.ceil(height / childHeight);

            if (height === this.props.maxHeight) {
                numberOfItems += this.props.itemPadding;
            }

            this.setState({
                childrenTop: 0,
                childrenBottom: childrenLength - numberOfItems,
                childrenToRender: numberOfItems,
                scrollTop: this.state.scrollTop,
                height: height,
                childHeight: childHeight
            });
        }

        componentDidUpdate() {
            if (this.state.childHeight !== this.getChildHeight()) {
                this.setState({
                    childrenTop: this.state.childrenTop,
                    childrenBottom: this.state.childrenBottom,
                    childrenToRender: this.state.childrenToRender,
                    scrollTop: this.state.scrollTop,
                    height: this.state.height,
                    childHeight: this.getChildHeight()
                });
            }
        }

        onScroll() {
            const scrollTop = this.container.scrollTop;
            const childrenLength = React.Children.count(this.props.children);

            const oldChildTop = this.state.childrenTop;
            const calcTop = scrollTop / this.state.childHeight;
            const tolerance = 0.1;

            let childrenTop = oldChildTop;

            if (Math.abs(oldChildTop - calcTop) > tolerance) {
                childrenTop = Math.floor(calcTop);
            }

            let childrenBottom = (childrenLength - childrenTop - this.state.childrenToRender);

            if (childrenBottom < 0) {
                childrenBottom = 0;
            }

            this.setState({
                childrenTop: childrenTop,
                childrenBottom: childrenBottom,
                childrenToRender: this.state.childrenToRender,
                scrollTop: scrollTop,
                height: this.state.height,
                childHeight: this.state.childHeight
            });
        }

        getChildHeight() {
            const firstChild = this.child0;
            return getElementHeight(firstChild);
        }

        cloneChildren() {
            const start = this.state.childrenTop;
            const end = this.state.childrenTop + this.state.childrenToRender;

            const childrenToRender = this.props.children.slice(start, end);

            return childrenToRender.map((child, index) => {
                if (index === 0) {
                    return React.cloneElement(child, { ref: (c: HTMLElement) => this.child0 = c });
                }
                return child;
            });
        }

        getChildren() {
            return this.cloneChildren();
        }

        render() {
            const children = this.getChildren();
            const childHeight = (this.state.childHeight) ? this.state.childHeight : 0;
            const childrenBottom = (this.state.childrenBottom) ? this.state.childrenBottom : 0;

            const styleTop = { height: this.state.childrenTop * childHeight };
            const styleEnd = { height: childrenBottom * childHeight };
            const styleDiv = { height: this.state.height, overflowY: 'auto' };

            children.unshift(<div style={styleTop} key="top"></div>);

            children.push(<div style={styleEnd} key="bottom"></div>);

            return (
                <div style={styleDiv}
                    className={this.props.className}
                    ref={(c: HTMLElement) => this.container = c}
                    onScroll={() => this.onScroll()}>
                    {children}
                </div>
            );
        }
    }

    function getHeight(numChildren: number, childHeight: number, maxHeight: number) {
        const fullHeight = numChildren * childHeight;
        return (fullHeight < maxHeight) ? fullHeight : maxHeight;
    }

    function getElementHeight(element: Element) {
        if (element === null) {
            return 0;
        }

        const elementStyle = window.getComputedStyle(element);

        let height = parse(elementStyle, 'height');

        const ua = window.navigator.userAgent;
        const ie10orOlder = ua.indexOf("MSIE ") >= 0;
        const ie11 = ua.indexOf("Trident") >= 0;

        if (ie10orOlder || ie11) {
            const borderTop = parse(elementStyle, 'border-top-width');
            const borderBottom = parse(elementStyle, 'border-bottom-width');
            const marginTop = parse(elementStyle, 'margin-top');
            const marginBottom = parse(elementStyle, 'margin-bottom');
            const paddingTop = parse(elementStyle, 'padding-top');
            const paddingBottom = parse(elementStyle, 'padding-bottom');

            height += borderTop + borderBottom + marginTop + marginBottom + paddingTop + paddingBottom;
        }

        return height;
    }

    function parse(styles: CSSStyleDeclaration, name: string) {
        const val = styles.getPropertyValue(name);
        return parseFloat(val) || 0;
    }

}
