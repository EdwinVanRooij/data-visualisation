var colorStaging = '#e9f7fb';
// var color = [
//     '#e9f7fb',
//     '#d4eff7',
//     '#bee7f3',
//     '#a9dfef',
//     '#93d7eb',
//     '#7ecfe7',
//     '#68c7e3',
//     '#53bfdf',
//     '#3db6db',
//     '#28aed7',
//     '#249dc2',
//     '#208cac',
//     '#1d809f',
//     '#1c7a97',
//     '#186981',
//     '#14576c',
//     '#104656',
//     '#0c3441',
//     '#08232b'];
var color = [
    '#04222f',
    '#053347',
    '#07455f',
    '#095677',
    '#0a6187',
    '#0b678e',
    '#0c78a6',
    '#0e89be',
    '#109ad5',
    '#12abed',
    '#2ab4ef',
    '#41bcf1',
    '#59c4f3',
    '#71cdf4',
    '#88d5f6',
    '#a0def8'];
var chinaColor = '#F25944';

var svg = d3.select("#bubble-chart").select("svg");

var width = d3.select("#bubble-chart").select("svg").node().width.baseVal.value;

var bubble = d3.layout.pack()
    .sort(null)
    .size([width, 1000])
    .padding(3);


//update function
function changebubble(data) {
    var node = svg.selectAll(".node")
        .data(
            bubble.nodes(classes(data)).filter(function (d) {
                return !d.children;
            }),
            function (d) {
                return d.className
            } // key data based on className to keep object constancy
        );

    // capture the enter selection
    var nodeEnter = node.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    // Entering circles
    nodeEnter
        .append("circle")
        .style("fill", function (d, i) {
            return colorStaging;
        })
        .attr("r", 0)
        .transition().duration(2500)
        .attr("r", function (d) {
            return d.r;
        });

    // Repositioning circles
    node.select("circle")
        .transition().duration(1500)
        .attr("r", function (d) {
            return d.r;
        })
        .transition().delay(3000).duration(500)
        .style("fill", function (d, i) {
            if (d.className === 'China') return chinaColor;
            return color[i];
        });

    node.transition()
        .duration(2500)
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    // Entering text
    nodeEnter
    // Pre transition
        .append("text")
        .attr('fill', 'white')
        .attr("opacity", 0)
        .text(function (d) {
            return d.className;
        })

        // During transition
        .transition().delay(3000).duration(750)

    // Post transition
        .attr("opacity", 1)
        .attr('transform', function (d) {
            return "translate(" + 0 + "," + 5 + ")";
        });

    removeBubbles(node);

    // Returns a flattened hierarchy containing all leaf nodes under the root.
    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function (child) {
                recurse(node.name, child);
            });
            else classes.push({
                packageName: name,
                className: node.name,
                value: node.size
            });
        }

        recurse(null, root);
        return {
            children: classes
        };
    }

}

function removeBubbles(nodeSelection) {
    // capture the enter selection
    var nodeExit = nodeSelection.exit();

    nodeExit.select("circle")
        .transition().duration(750)
        .attr("r", 0)
        .remove();

    nodeExit.select("text")
        .transition().duration(500)
        .attr("opacity", 0)
        .remove();

    nodeSelection.exit()
        .transition().duration(750)
        .remove();
}

function startRemovalAnimation() {
    var node = svg.selectAll(".node")
        .data([]);
    removeBubbles(node);
}

function playAnimation() {
    var index = 0;
    var indexUsed = 0;
    var delay = 4750;
    var startingYear = 2008;
    while (index < 9) {
        startRemovalAnimation();

        var timeout = delay + (delay * index);
        if (index === 0) {
            timeout -= 3500;
        }
        setTimeout(function () {
            var year = startingYear + indexUsed;
            updateBubbles(year);
            indexUsed++;
        }, timeout);
        console.log(timeout);
        index++;
    }
}

function updateYear(newYear) {
    document.getElementsByClassName('year')[0].children[0].innerText = newYear;

    // var selection = d3.selectAll(".year").selectAll("h1");
    //
    // selection
    // // Pre transition
    //     .attr('fill', 'black')
    //     .attr("opacity", 0.7)
    //     .text(newYear)
    //
    //     // During transition
    //
    // // Post transition
    //     .attr("opacity", 0.3)
    //     .attr('transform', function (d) {
    //         return "translate(" + 0 + "," + 5 + ")";
    //     })
    //     .remove();

            // selection.append("h1")
        //     .attr()
    // capture the enter selection
    // var nodeEnter = d3.sele.enter()
    // // Pre transition
    //     .append("text")
    //     .attr('fill', 'white')
    //     .attr("opacity", 0)
    //     .text(function (d) {
    //         return d;
    //     })
    //
    //     // During transition
    //     .transition().duration(750)
    //
    // // Post transition
    //     .attr("opacity", 1)
    //     .attr('transform', function (d) {
    //         return "translate(" + 0 + "," + 5 + ")";
    //     });
    //
    // // removeBubbles(node);

    //     }
    //
    //     recurse(null, root);
    //     return {
    //         children: classes
    //     };
    // }
}

function updateBubbles(year) {
    updateYear(year);
    d3.csv('data/' + year + "_100.csv", function (error, data) {

        data = data.slice(0, 15); // only use the first 20 records
        data = data.map(function (d) {
            return {name: capitalizeFirstLetter(d["word"]), size: d["frequency"]}
        });
        var formatted_data = {
            "children": data
        };
        changebubble(formatted_data)
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function initSlider() {
    d3.select('#slider').call(d3.slider()
        .axis(true).min(2008).max(2016).step(1)
        .on("slide", function (evt, value) {

            updateBubbles(value);
        })
    );
}

updateBubbles(2008);
initSlider();
