import React, { Component } from 'react'

class FiltroAreas extends Component {
    constructor(props) {
        super(props);

        const seleccion = {};

        for (let accion in props.acciones) {
            seleccion[props.acciones[accion].area] = 1;
        } 

        this.state = {
            seleccion,
            filtro: props.filtro
        };

        this.cambiaArea = this.cambiaArea.bind(this);
        this.cambiaTodos = this.cambiaTodos.bind(this);
    }

    cambiaTodos(e, activar) {
        for (let area in this.state.seleccion)
            this.state.seleccion[area] = activar ? 1 : 0;

        this.state.filtro('accion', { tipo: 'area', input: this.state.seleccion });
        this.setState(this.state);
    }

    cambiaArea(e) {
        let area = e.currentTarget.getAttribute('data-id-filtro');
        this.state.seleccion[area] = this.state.seleccion[area] == 0 ? 1 : 0;

        this.state.filtro('accion', { tipo: 'area', input: this.state.seleccion });
        this.setState(this.state);        
    }

    render() {
        let selectElems = []

        for (let area in this.state.seleccion) {
            selectElems.push(
                <div
                    className={'elemFiltro ' + (this.state.seleccion[area] == 0 ? 'filtroOff' : 'filtroOn')}
                    data-id-filtro={area}
                    onClick={this.cambiaArea}
                >
                    {area}
                </div>
            )
        }

        selectElems.sort((e1, e2) => {
            if(e2.props['data-id-filtro'] < e1.props['data-id-filtro'])
                return 1;

            return 0;
        });

        return <div style={{ marginBottom: '3px', display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '12px', marginRight: '5px', color: 'darkblue' }}>Filtro área:</div>
            <div 
                className='elemFiltroGen'
                onClick={(e) => this.cambiaTodos(e, true)}
            >
                Todas
            </div>
            <div 
                className='elemFiltroGen'
                onClick={(e) => this.cambiaTodos(e, false)}
            >
                Ninguna
            </div>
            {selectElems}
        </div>
    }
}

export default FiltroAreas