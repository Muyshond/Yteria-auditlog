import ExtensionAPI from 'sap/fe/core/ExtensionAPI';
import UI5Event from 'sap/ui/base/Event';
import MessageToast from 'sap/m/MessageToast';
import { Chart } from 'chart.js';


/**
 * Generated event handler.
 *
 * @param this reference to the 'this' that the event handler is bound to.
 * @param event the event object provided by the event provider
 */
export function onPress(this: ExtensionAPI, event: UI5Event) {
    MessageToast.show("Custom handler invoked.");
    const canvas = document.getElementById("Canvasid") as HTMLCanvasElement;
    if (!canvas) {
        console.error("Canvas element not found.");
        MessageToast.show("error.")
        return;
    }
    const ctx = canvas.getContext("2d");    

    if(ctx){
        new Chart(ctx, {
            type: 'bar', 
            data: {
                labels: ['A', 'B'], 
                datasets: [{
                    label: 'Dataset',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    data: [10, 20], 
                }]
            },
            options: {
                responsive: false, 
                scales: {
                    x: {
                        display: false, 
                    },
                    y: {
                        display: false, 
                        min: 0,         
                        max: 25         
                    }
                },
                plugins: {
                    legend: {
                        display: false 
                    },
                    title: {
                        display: false 
                    }
                }
            }
        });
    }


}

