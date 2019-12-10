var mjAPI = require('mathjax-node');

mjAPI.config({
	MathJax: {
		// traditional MathJax configuration
	}
});
mjAPI.start();
// var yourMath = 'E = mc^2';
var yourMath = `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
   <mi>E</mi>
   <mo>=</mo>
   <mi>m</mi>
   <msup>
     <mi>c</mi>
     <mn>2</mn>
   </msup>
 </math>`;

function MathJax(math) {
	return mjAPI.typeset({
		math: math,
		format: 'MathML', // or "inline-TeX", "MathML"
		svg: true // or svg:true, or html:true
	});
	try {
		return mjAPI.typeset(
			{
				math: math,
				format: 'MathML', // or "inline-TeX", "MathML"
				svg: true // or svg:true, or html:true
			},
			mathRender
		);
	} catch (error) {
		return {
			success: false,
			data: error
		};
	}
}

function mathRender(data) {
	if (!data.errors) {
		console.log(data.svg);
		return { success: true, data: data.svg };
	} else return { success: false, data: data.errors };
	// will produce:
	// <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
	//   <mi>E</mi>
	//   <mo>=</mo>
	//   <mi>m</mi>
	//   <msup>
	//     <mi>c</mi>
	//     <mn>2</mn>
	//   </msup>
	// </math>
}

module.exports = MathJax;
