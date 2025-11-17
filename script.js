const modal1 = new Floater({
    content: '<h2>Classic Modal</h2><p>This is a classic modal</p>',
});
document.querySelector("#open-modal-1").onclick = () => {
    modal1.open();
};

const modal2 = new Floater({
    template: 'modal-2',
});
document.querySelector("#open-modal-2").onclick = () => {
    modal2.open();
};

const modal3 = new Floater({
    template: 'modal-3',
    destroyOnClose: false,
});
document.querySelector("#open-modal-3").onclick = () => {
    modal3.open();
};

const modal4 = new Floater({
    template: 'modal-4',
    footer: true
});
document.querySelector("#open-modal-4").onclick = () => {
    modal4.open();
};
modal4.addFooterButton("Cancel", "cancel-btn modal-btn", ()=>{
    modal4.close();
})
modal4.addFooterButton("Submit", "submit-btn modal-btn", ()=>{
    modal4.close();
})

const modal5 = new Floater({
    template: 'modal-5',
});
document.querySelector("#open-modal-5").onclick = () => {
    modal5.open();
};

const modal6 = new Floater({
    template: 'modal-6',
    lockScroll: false,
});
document.querySelector("#open-modal-6").onclick = () => {
    modal6.open();
};

