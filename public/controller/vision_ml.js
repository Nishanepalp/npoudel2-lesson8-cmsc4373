const MIN_PROBABILITY = 0.3;

const model = await mobilenet.load();

export async function imageClassifier(imgElement){
    const labels=[];
    const prediction = await model.classify(imgElement);
    //console.log(prediction);
    prediction.forEach(element => {
        if(element.probability >= MIN_PROBABILITY){
            const list =element.className.split(/[,| ]+/);
            labels.push(...list);
        }
    });
    const unqueLabels = [];
    labels.forEach(e => {
        if(!unqueLabels.includes(e)) unqueLabels.push(e);
    });

    return unqueLabels;
}