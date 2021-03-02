/**
 * Copy 'src' from img tag to background of a parent tag.
 */
export default function Ibg() {
    let ibgs = document.getElementsByClassName('ibg');
    if (ibgs.length) {
        for (let item of ibgs) {
            let imgSrc = item.children[0].attributes[0].value;
            item.style = `background-image: url("${imgSrc}");`;
        }
    } else {
        console.log('No elements with class "ibg"!');
    }
};