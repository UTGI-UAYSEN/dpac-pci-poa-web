import React, { Component } from 'react'

class FiltroPOA extends Component {
    constructor(props) {
        super(props);

        const seleccion = {};
        const areas = {};

        const obtenerSelector = (idActor) => {
            if(!seleccion[idActor])
                seleccion[idActor] = {};

            return seleccion[idActor];
        };

        for (let accionId in props.data.acciones) {
            let accion = props.data.acciones[accionId];

            let selectorArea = obtenerSelector(accion.area);
            selectorArea.area = true;
            areas[accion.area] = true;

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
            roles: { Responsable: true, Aprobador: true, Soporte: true, Consultado: true, Informado: true },
            tacticas: { Función: true, Hito: true, Prioritaria: false },
            meses: { mar: true, abr: true, may: true, jun: true, jul: true, ago: true, sep: true, oct: true, nov: true, dic: true, ene: true, },
            areas,
            filtro: props.filtro,
            filtroG: props.filtroG
        };
    }

    cambiaTodos(e, activar) {
        for (let actor in this.state.seleccion) {
            let filtroInfo = this.state.seleccion[actor];

            if(filtroInfo.area != undefined) filtroInfo.area = activar ? true : false;
            if(filtroInfo.resp != undefined) filtroInfo.resp = activar ? true : false;
            if(filtroInfo.cap != undefined) filtroInfo.cap = activar ? true : false;
        }
        
        this.state.filtro('tacticas', this.state);
        this.setState(this.state);
    }

    cambiaActor(e, tipoCambio) {
        let idActor = e.currentTarget.getAttribute('data-id-filtro');
        this.state.seleccion[idActor][tipoCambio] = this.state.seleccion[idActor][tipoCambio] == 0 ? 1 : 0;
        this.state.filtro('tacticas', this.state);
        
        this.setState(this.state);        
    }

    cambiaRol(e) {
        let rol = e.currentTarget.getAttribute('data-rol');
        this.state.roles[rol] = !this.state.roles[rol] ? true : false;
        this.state.filtro('tacticas', this.state);

        this.setState(this.state); 
    }

    cambiaTodosRoles(e, activar) {
        for (let rol in this.state.roles)
            this.state.roles[rol] = activar ? true : false;
        
        this.state.filtro('tacticas', this.state);
        this.setState(this.state);
    }

    cambiaTacticaProp(e) {
        let prop = e.currentTarget.getAttribute('data-tactica-prop');
        this.state.tacticas[prop] = !this.state.tacticas[prop] ? true : false;
        this.state.filtro('tacticas', this.state);

        this.setState(this.state); 
    }

    cambiaMes(e) {
        let mes = e.currentTarget.getAttribute('data-mes');
        this.state.meses[mes] = !this.state.meses[mes] ? true : false;
        this.state.filtro('tacticas', this.state);

        this.setState(this.state); 
    }

    cambiaTodosMeses(e, activar) {
        for (let mes in this.state.meses)
            this.state.meses[mes] = activar ? true : false;
        
        this.state.filtro('tacticas', this.state);
        this.setState(this.state);
    }

    render() {
        let selectElems = []

        for (let actor in this.state.seleccion) {
            let filtroInfo = this.state.seleccion[actor];

            selectElems.push(
                <div
                    className={(this.state.areas[actor] ? 'filtroArea ' : '') + ' elemFiltro'}
                    data-actor={actor}
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
            if(e2.props['data-actor'] < e1.props['data-actor'])
                return 1;

            return 0;
        });

        let rolesElems = [];

        for (let rol in this.state.roles) {
            rolesElems.push(
                <div 
                    className={'elemFiltro actFiltro' + (this.state.roles[rol] ? ' filtroOn': ' filtroOff')}
                    data-rol={rol}
                    onClick={(e) => this.cambiaRol(e)}
                    style={{ fontSize: '12px' }}
                >
                    {rol}
                </div>
            );
        }

        let tacticaElems = [];

        for (let tacticaProp in this.state.tacticas) {
            tacticaElems.push(
                <div 
                    className={'elemFiltro actFiltro' + (this.state.tacticas[tacticaProp] ? ' filtroOn': ' filtroOff')}
                    data-tactica-prop={tacticaProp}
                    onClick={(e) => this.cambiaTacticaProp(e)}
                    style={{ fontSize: '12px' }}
                >
                    {tacticaProp}
                </div>
            );
        }

        let mesesElems = [];

        for (let mes in this.state.meses) {
            mesesElems.push(
                <div 
                    className={'elemFiltro actFiltro' + (this.state.meses[mes] ? ' filtroOn': ' filtroOff')}
                    data-mes={mes}
                    onClick={(e) => this.cambiaMes(e)}
                    style={{ fontSize: '12px' }}
                >
                    {mes}
                </div>
            );
        }

        return <div>
            <div className='filtrCont'>
                <div className='filtrEtiqueta'>Actores</div>
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
            <div className='filtrCont'>
                <div className='filtrEtiqueta'>Roles</div>
                <div 
                    className='elemFiltroGen'
                    onClick={(e) => this.cambiaTodosRoles(e, true)}
                >
                    Todo
                </div>
                <div 
                    className='elemFiltroGen'
                    onClick={(e) => this.cambiaTodosRoles(e, false)}
                >
                    Nada
                </div>
                {rolesElems}
            </div>
            <div className='filtrCont'>
                <div className='filtrEtiqueta'>Tácticas</div>
                {tacticaElems}
            </div>
            <div className='filtrCont'>
            <div className='filtrEtiqueta'>Meses</div>
                <div 
                    className='elemFiltroGen'
                    onClick={(e) => this.cambiaTodosMeses(e, true)}
                >
                    Todo
                </div>
                <div 
                    className='elemFiltroGen'
                    onClick={(e) => this.cambiaTodosMeses(e, false)}
                >
                    Nada
                </div>                
                {mesesElems}
            </div>
            <div className='filtrCont'>
                <div className='filtrEtiqueta'>Texto</div>
                <input
                    onChange={e => {
                        this.state.filtroG(e.target.value);
                    }}
                    style={{ fontSize: '10px', width: '200px' }}
                />
            </div>
        </div>
    }
}

export default FiltroPOA