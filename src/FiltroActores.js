import React, { Component } from 'react'

class FiltroActores extends Component {
    constructor(props) {
        super(props);

        const seleccion = {};

        for (let actor in props.actores)
            seleccion[actor] = 1;

        this.state = {
            seleccion,
            filtro: props.filtro
        };

        this.cambiaActor = this.cambiaActor.bind(this);
        this.cambiaTodos = this.cambiaTodos.bind(this);
    }

    cambiaTodos(e, activar) {
        for (let actor in this.state.seleccion)
            this.state.seleccion[actor] = activar ? 1 : 0;

        this.state.filtro('tacticas', { tipo: 'actor', input: this.state.seleccion });
        this.setState(this.state);
    }

    cambiaActor(e) {
        let idActor = e.currentTarget.getAttribute('data-id-filtro');
        this.state.seleccion[idActor] = this.state.seleccion[idActor] == 0 ? 1 : 0;

        this.state.filtro('tacticas', { tipo: 'actor', input: this.state.seleccion });
        this.setState(this.state);        
    }

    render() {
        let selectElems = []

        for (let actor in this.state.seleccion) {
            selectElems.push(
                <div
                    className={'elemFiltro ' + (this.state.seleccion[actor] == 0 ? 'filtroOff' : 'filtroOn')}
                    data-id-filtro={actor}
                    onClick={this.cambiaActor}
                >
                    {actor}
                </div>
            );
        }

        selectElems.sort((e1, e2) => {
            if(e2.props['data-id-filtro'] < e1.props['data-id-filtro'])
                return 1;

            return 0;
        });

        return <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '12px', marginRight: '5px', color: 'darkblue' }}>Filtro capacidades:</div>
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

export default FiltroActores