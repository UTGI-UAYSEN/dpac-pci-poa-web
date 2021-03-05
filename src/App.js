import React from 'react'
import { useTable, useFilters, useGroupBy, useSortBy, useGlobalFilter, useAsyncDebounce } from 'react-table'
import mData from './data.json'
import FiltroPOA from './FiltroPOA'

const indicesRoles = { 'Responsable': 0, 'Aprobador': 1, 'Soporte': 2, 'Consultado': 3, 'Informado': 4 }

function obtenerElementosCapacidadesTacticas(tactica) {
	let capContElems = [null, null, null, null, null];

	for (let capRol in tactica.capacidades) {
		let capsDetallesElems = [];

		for (let j in tactica.capacidades[capRol]) {
			let capInfo = tactica.capacidades[capRol][j];
			let capsDetalles = mData.meta.capacidades[capInfo.id];

			capsDetallesElems.push(<div className="contCapDetalle">
				<div className='genLabelB' style={{ fontSize: '10px' }}>{capsDetalles.actor}</div>
				<div className='genLabelG' style={{ fontSize: '10px' }}>{capsDetalles.tipo}</div>
				<div className='nombreCapacidad'>{capsDetalles.desc} </div>
			</div>);
		}

		capContElems[indicesRoles[capRol]] = <div className="contCapRol">
			<div className="contRol">{capRol}</div>
			<div className="contCapsDetalles">
				{capsDetallesElems}
			</div>
		</div>;
	}

	return capContElems;
}

function obtenerElementosIndicadoresMDVs(tactica) {
	let capContIndMDVs = [];

	if (tactica.ios.length > 0) {
		capContIndMDVs.push(<div className="contInd">
			<div className="contIndDesc">
				<div>
					<span className="genLabelBL">Indicador</span>
					<span style={{ fontWeight: 'bold' }}>{tactica.ios[0].nombre}</span>
				</div>
				<div>
					<span style={{ fontStyle: 'italic' }}>{tactica.ios[0].formula}</span>
				</div>
			</div>
			<div className="contIndMeta">
				<div style={{ fontSize: '13px', fontWeight: 'bold' }}>Meta</div>
				<div style={{ fontSize: '22px', fontWeight: 'bold' }}>{tactica.ios[0].meta}</div>
			</div>
		</div>);
	}

	for (let i in tactica.mdvs) {
		let estandaresElems = [];

		for (let j in tactica.mdvs[i].estandares) {
			estandaresElems.push(<li style={{ margin: '0px' }}>{tactica.mdvs[i].estandares[j]}</li>)
		}

		capContIndMDVs.push(<div className="contMDV">
			<div className="contMDVDesc">
				<div>
					<span className="genLabelBL">MDV</span>
					<span style={{ fontWeight: 'bold' }}>{tactica.mdvs[i].nombre}</span>
				</div>
				<div className="contMDVEstandares">
					<div className="contListaEstandares">
						<ul>{estandaresElems}</ul>
					</div>
				</div>
			</div>
			{tactica.mdvs[i].plazo ? <div className="contMDVPlazo">
				<div style={{ fontSize: '12px', fontWeight: 'bold' }}>Plazo</div>
				<div style={{ fontSize: '20px', fontWeight: 'bolder' }}>{tactica.mdvs[i].plazo}</div>
			</div> : <></>}
		</div>);
	}

	return capContIndMDVs;
}

function renderCell(cellInfo) {
	if (cellInfo.column.id == 'accion') {
		const idAccion = cellInfo.value;
		const accion = mData.meta.acciones[idAccion];
		const respAccion = mData.meta.actores[accion.responsable];

		return <div className="contAccion">
			<div className="contAccionInfo">
				<div className='accionId'>{idAccion}</div>
				<div className='genLabelB'>{accion.responsable}</div>
				<div className='genLabelG'>{accion.tipo}</div>
			</div>
			<div className="contAccionDetalle">
				<div className='accionTitulo'>{accion.titulo}</div>
				<div className='accionObjetivo'>{accion.objetivo}</div>
			</div>
		</div>;
	}
	else if (cellInfo.column.id == 'tacticas') {
		//console.log(cellInfo);
		let baseElem = []

		for (let i in cellInfo.row.subRows) {
			const tactica = mData.meta.tacticas[cellInfo.row.subRows[i].original.tactica];

			const capContElems = obtenerElementosCapacidadesTacticas(tactica);
			const capContIndicadoresMDVs = obtenerElementosIndicadoresMDVs(tactica);

			const elemTactica = <div className="contTactica">
				<div className="contTacticaDesc">
					<div className={'tacticaId ' + (tactica.tipo == 'Función' ? 'funcion' : 'hito')}>{tactica.tipo} {tactica.cod}</div>
					{tactica.prioridad == 'Alta' ? <div className='indPrioridad'>Prioritaria</div> : null}
					<div className="tacticaDesc">{tactica.desc}</div>
				</div>
				<div className="contTacticaDetalles">
					<div className="contTacticaCaps">
						{capContElems}
					</div>
					<div className="contTacticaIndMDVs">
						{capContIndicadoresMDVs}
					</div>
				</div>
			</div>

			baseElem.push(elemTactica);
		}

		return <>{baseElem}</>;
	}
	else if (cellInfo.column.id == 'mdvs-ios') {
		return <div>{cellInfo.value}</div>;
	}
	else {
		return 'No configurado.'
	}
}

function obtenerBuscador(filtro) {
	return (texto) => {
		return texto !== undefined
			? String(texto)
				.toLowerCase()
				.includes(String(filtro).toLowerCase())
			: true;
	}
}

function Table({ columns, data }) {
	const filterTypes = React.useMemo(
		() => ({
			text: (rows, ids, filterValue) => {
				return rows.filter(row => {
					let buscador = obtenerBuscador(filterValue);
					let accion = mData.meta.acciones[row.values['accion']];
					let tactica = mData.meta.tacticas[row.values['tacticas']];

					if (buscador(row.values['accion'])) return true;
					if (buscador(accion.area)) return true;
					if (buscador(accion.objetivo)) return true;
					if (buscador(accion.responsable)) return true;
					if (buscador(accion.titulo)) return true;

					if (buscador(row.values['tacticas'])) return true;
					if (buscador(tactica.cod)) return true;
					if (buscador(tactica.desc)) return true;

					for (let i in tactica.mdvs) {
						let mdv = tactica.mdvs[i];
						if (buscador(mdv.nombre)) return true;

						for (let j in mdv.estandares)
							if (buscador(mdv.estandares[j])) return true;
					}

					for (let i in tactica.ios) {
						let io = tactica.ios[i];
						if (buscador(io.nombre)) return true;
						if (buscador(io.formula)) return true;
					}

					return false;
				})
			},
			actor: (rows, id, filterValue) => {
				let filtroActores = filterValue.seleccion;
				let filtroTacticaProps = filterValue.tacticas;
				let filtroRol = filterValue.roles;
				let filtroMes = filterValue.meses;

				return rows.filter(row => {

					let tactica = mData.meta.tacticas[row.values['tacticas']];

					if (filtroTacticaProps.Prioritaria && tactica.prioridad != 'Alta')
						return false;

					if (!filtroTacticaProps.Función && tactica.tipo == 'Función')
						return false;

					if (!filtroTacticaProps.Hito && tactica.tipo == 'Hito')
						return false;

					if (tactica.tipo == 'Hito') {
						let check = false;
						let i = 0;

						while(!check && i < tactica.mdvs.length) {
							let mdv = tactica.mdvs[i];
							check = check || filtroMes[mdv.plazo];

							i++;
						}

						if(!check)
							return false;
					}

					for (let rol in tactica.capacidades) {
						for (let j in tactica.capacidades[rol]) {
							let actorCap = mData.meta.capacidades[tactica.capacidades[rol][j].id].actor;

							if (filtroActores[actorCap].cap) {
								if (filtroRol[rol])
									return true;
							}
						}
					}

					let accion = mData.meta.acciones[row.values['accion']];

					if (filtroActores[accion.area].area || filtroActores[accion.responsable].resp)
						return true;

					return false;
				})
			},
		}),
		[]
	)

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		setFilter,
		setGlobalFilter,
	} = useTable({
		columns,
		data,
		initialState: {
			groupBy: ['accion'],
			sortBy: [{ id: 'accion' }, { id: 'tacticas' }]
		},
		filterTypes,
		globalFilter: 'text'
	},
		useGlobalFilter,
		useFilters,
		useGroupBy,
		useSortBy
	)

	return (
		<>
			<div>
				<table {...getTableProps()}>
					<thead>
						<tr>
							<th className='headerFiltros' colSpan='2' style={{ textAlign: 'left' }}>
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
									<div style={{ display: 'flex', alignItems: 'center'}}>
										<img src={process.env.PUBLIC_URL + '/favicon.png'} alt="Logo" width="80" />
										<div style={{ fontWeight: 'bold', fontSize: '40px', color: 'midnightblue', textAlign: 'right', marginLeft: '10px', marginBottom: '10px' }}>Navegador POA</div>
									</div>
									<div style={{ display: 'flex', flexDirection: 'column'/*, alignItems: 'flex-end'*/ }}>
										<div style={{ fontWeight: 'bold', fontSize: '12px', color: 'mediumblue' }}>Versión 1.1.0</div>
										<div style={{ fontWeight: 'bold', fontSize: '10px' }}>
											Desarrollado por <span style={{ color: 'mediumblue' }}>Dirección de Planificación y Aseguramiento de la Calidad</span></div>
										<div style={{ fontWeight: 'bold', fontSize: '10px' }}>Consultas: <a href="mailto:enrique.urra@uaysen.cl">enrique.urra@uaysen.cl</a></div>
										<div style={{ fontWeight: 'bold', fontSize: '12px' }}><a target='_blank' href={process.env.PUBLIC_URL + '/Manual - Navegador POA.pdf'}>[Descargar Manual]</a></div>
									</div>
								</div>
								<FiltroPOA
									data={mData.meta}
									filtro={setFilter}
									filtroG={useAsyncDebounce(value => {
										setGlobalFilter(value || undefined)
									}, 200)}
								/>
							</th>
						</tr>
						{headerGroups.map(headerGroup => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<th width={column.width} {...column.getHeaderProps()}>
										{column.render('Header')}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()}>
						{rows.length == 0 ? <tr><td colSpan='2' style={{ textAlign: 'center', fontWeight: 'bold' }}>No hay datos que mostrar.</td></tr> :
							rows.map((row, i) => {
								prepareRow(row);
								return (
									<tr {...row.getRowProps()}>
										{row.cells.map(cell => {
											return (
												<td style={{ verticalAlign: 'top' }} {...cell.getCellProps()}>
													{cell.isGrouped ? (
														// If it's a grouped cell, add an expander and row count
														<>
															{cell.render('Cell')}
														</>
													) : cell.isAggregated ? (
														// If the cell is aggregated, use the Aggregated
														// renderer for cell
														cell.render('Aggregated')
													) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
														// Otherwise, just render the regular cell
														cell.render('Cell')
													)}
												</td>
											);
										})}
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		</>
	)
}

function App() {
	const columns = React.useMemo(
		() => [
			{
				id: "accion",
				Header: <div style={{ backgroundColor: 'black', color: 'white', borderRadius: '5px' }}>
					Acción
        </div>,
				accessor: 'accion',
				Cell: renderCell,
				//Filter: SelectColumnFilter,
				filter: 'actor',
				width: '30%'/*,
        sortType: sortFuncs.actor*/
			},
			{
				id: "tacticas",
				Header: <div style={{ backgroundColor: 'black', color: 'white', borderRadius: '5px' }}>
					Tacticas, roles, indicadores y MDVs
        </div>,
				accessor: 'tactica',
				Cell: renderCell,
				filter: 'actor',
				width: '70%'
				//Cell: renderCell
			}
		],
		[]
	)

	return (
		<Table columns={columns} data={mData.data} />
	)
}

export default App