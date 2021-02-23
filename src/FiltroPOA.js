import React, { Component } from 'react'

class FiltroPOA extends Component {
    constructor(props) {
        super(props);

        const seleccion = {};
        const obtenerSelector = (idActor) => {
            if(!seleccion[idActor])
                seleccion[idActor] = {};

            return seleccion[idActor];
        };

        for (let accionId in props.data.acciones) {
            let accion = props.data.acciones[accionId];

            let selectorArea = obtenerSelector(accion.area);
            selectorArea.area = true;

            let selectorResp = obtenerSelector(accion.responsable);
            selectorResp.resp = true;
        }

        for (let tacticaId in props.data.tacticas) {
            let tactica = props.data.tacticas[tacticaId];

            for(let rol in tactica.capacidades) {
                for(let i in tactica.capacidades[rol]) {
                    let idCap = tactica.capacidades[rol][i].id;
                    let capObj = props.data.capacidades[idCap];

                    let selectorCap = obtenerSelector(capObj.actor);
                    selectorCap.cap = true;
                }
            }
        }

        this.state = {
            seleccion,
            filtro: props.filtro
        };
    }

    cambiaTodos(e, activar) {
        for (let actor in this.state.seleccion) {
            let filtroInfo = this.state.seleccion[actor];

            if(filtroInfo.area != undefined) filtroInfo.area = activar ? true : false;
            if(filtroInfo.resp != undefined) filtroInfo.resp = activar ? true : false;
            if(filtroInfo.cap != undefined) filtroInfo.cap = activar ? true : false;
        }
        
        this.state.filtro('tacticas', this.state.seleccion);
        this.setState(this.state);
    }

    cambiaActor(e, tipoCambio) {
        let idActor = e.currentTarget.getAttribute('data-id-filtro');
        this.state.seleccion[idActor][tipoCambio] = this.state.seleccion[idActor][tipoCambio] == 0 ? 1 : 0;
        this.state.filtro('tacticas', this.state.seleccion);
        
        this.setState(this.state);        
    }

    render() {
        let selectElems = []

        for (let actor in this.state.seleccion) {
            let filtroInfo = this.state.seleccion[actor];

            selectElems.push(
                <div
                    className='elemFiltro'                    
                    style={{ display: 'flex', alignItems: 'center' }}
                >                    
                    <div style={{ padding: '3px' }}>{actor}</div>
                    <div style={{ display: 'flex' }}>
                        {filtroInfo.area == undefined ? null : 
                            <div 
                                className={'actFiltro' + (filtroInfo.area ? ' filtroOn': ' filtroOff')}
                                data-id-filtro={actor}
                                onClick={(e) => this.cambiaActor(e, 'area')}
                            >A</div>
                        }
                        {filtroInfo.resp == undefined ? null : 
                            <div 
                                className={'actFiltro' + (filtroInfo.resp ? ' filtroOn': ' filtroOff')}
                                data-id-filtro={actor}
                                onClick={(e) => this.cambiaActor(e, 'resp')}
                            >R</div>
                        }
                        {filtroInfo.cap == undefined ? null : 
                            <div 
                                className={'actFiltro' + (filtroInfo.cap ? ' filtroOn': ' filtroOff')}
                                data-id-filtro={actor}
                                onClick={(e) => this.cambiaActor(e, 'cap')}
                            >C</div>
                        }
                    </div>
                </div>
            );
        }

        selectElems.sort((e1, e2) => {
            if(e2.props['data-id-filtro'] < e1.props['data-id-filtro'])
                return 1;

            return 0;
        });

        return <div style={{ display: 'flex', flexWrap: 'wrap' }}>            
            <div 
                className='elemFiltroGen'
                onClick={(e) => this.cambiaTodos(e, true)}
            >
                Todo
            </div>
            <div 
                className='elemFiltroGen'
                onClick={(e) => this.cambiaTodos(e, false)}
            >
                Nada
            </div>
            {selectElems}
        </div>
    }
}

export default FiltroPOA