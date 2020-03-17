import React, { useState, useEffect } from 'react';
import { Link as DefLink } from 'react-router-dom';
import styled from 'styled-components';
import $ from 'jquery';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import map from './map.svg';

const LINK = `https://cometari-airportsfinder-v1.p.rapidapi.com`;
const HOST = `cometari-airportsfinder-v1.p.rapidapi.com`;
const KEY  = `5dc0def65bmsh9f4807c6f5f3189p14a691jsne793e8319ffb`;

const Wrap = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgb(245,245,245);
`;

const Content = styled.div`
  height: 100vh;
  width: 100vw;
  max-width: 1600px;
  background: linear-gradient(rgba(245,245,245,.9), rgba(245,245,245,.9)), url(${map});
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Text = styled.div`
  text-align: center;
  width: 100vw;
  max-width: 400px;
  font-family: sans-serif;
  font-size: 22px;
  font-weight: lighter;
  background: white;
  padding: 60px 35px 60px 35px;
  border-radius: 16px 16px 0 0;
  box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
  color: rgba(0,0,0,0.5);
`;

const Button = styled.div`
  font-family: sans-serif;
  width: 470px;
  height: 50px;
  background: rgb(79, 144, 243);
  color: white;
  margin-top: -25px;
  box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ButtonBottomBorder = styled.div`
  height: 1px;
  margin-top: -1px;
  width: 470px;
  border-bottom: dotted 4px rgb(79, 144, 243);
`;

const Changable = styled.b`
  cursor: pointer;
  color: black;
`;

const List = styled.div`
  display: inline-block;
  position: relative;
  margin-left: 6px;
`;

const ListUl = styled.ul`
  text-align: left;
  position: absolute;
  padding: 0;
  top: 0;
  left: 0;
  display: ${props => props.active ? 'block' : 'none' };
  background: white;
  padding: 5px 15px 5px 15px;
  border-radius: 5px;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.2);
  z-index: 999;
`;

const ListUlLi = styled.li`
  list-style: none;
  color: rgba(125, 64, 191, 1);
`;

const Option = styled.a`
  text-decoration: none;
  color: black;
  font-weight: 800;
`;

const Link = styled(DefLink)`
  text-decoration: none;
  color: white;
`;

const formatDate = (input) => {
  let date = new Date(input);
  let values = [ date.getDate(), date.getMonth() + 1 ];
  for( var id in values ) {
    values[ id ] = values[ id ].toString().replace( /^([0-9])$/, '0$1' );
  }
  return `${values[0]}.${values[1]}.${date.getFullYear()}`;
}

export const Home = (props) => {

  const [country, setCountry] = useState('ru');
  const [airport, setAirport] = useState(null);
  const [airportShort, setAirportShort] = useState(null);
  const [airports, setAirports] = useState([]);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
  ]);

  const parseCountryCode = (countryName) => {
    switch(countryName) {
      case 'Россия':
        return 'ru';
      case 'Казахстан':
        return 'kz';
      case 'Украина':
        return 'ua';
      case 'Узбекистан':
        return 'uz';
      case 'Киргизия':
        return 'kg';
      default:
        return 'kz';
    };
  };

  const handleAirport = (e) => {
    setAirport(e.target.value);
  }

  const handleClick = (e) => {
    if(!state[0].endDate) e.preventDefault();
  }

  useEffect(() => {
    setTimeout(() => {
      $('.placeholder').on('click', function (ev) {
        $('.placeholder').css('opacity', '0');
        $('.list__ul').toggle();
      });
      $('.list__ul a').on('click', function (ev) {
        ev.preventDefault();
        const index = $(this).parent().index();
        $('.placeholder').text( $(this).text() ).css('opacity', '1');
        $('.list__ul').find('li').eq(index).prependTo('.list__ul');
        $('.list__ul').toggle();
        setCountry(null);
        setCountry(parseCountryCode($(this).text()));
      });
    }, 100);
    setTimeout(() => {
      $('.placeholderAir').on('click', function (ev) {
        $('.list__ulAir').toggle();
      });
      $('.placeholderAir').focusout(() => {
        setTimeout(() => {
          $('.list__ulAir').toggle();
        }, 300);
      });
      $('.list__ulAir a').on('click', function (ev) {
        ev.preventDefault();
        const index = $(this).parent().index();
        $('.list__ulAir').find('li').eq(index).prependTo('.list__ulAir');
        setAirport(null);
        setAirport($(this).text());
        setAirportShort($(this).text().match(/\(.*?\)/)[0].replace('(', '').replace(')', ''));
      });
    }, 100);
  }, []);

  useEffect(() => {
    if(!airport) return;
    fetch(`${LINK}/api/airports/by-text?text=${airport}`, {
    	"method": "GET",
    	"headers": {
    		"x-rapidapi-host": HOST,
    		"x-rapidapi-key": KEY
    	}
    })
    .then(response => response.json()).then(body => {
      if(body.length !== 0) setAirports(body.map(ap => {
        return(<ListUlLi><Option href="#">{ ap.name } ({ ap.code })</Option></ListUlLi>);
      }));
      $('.list__ulAir a').on('click', function (ev) {
        ev.preventDefault();
        const index = $(this).parent().index();
        $('.list__ulAir').find('li').eq(index).prependTo('.list__ulAir');
        setAirport(null);
        setAirport($(this).text());
        setAirportShort($(this).text().match(/\(.*?\)/)[0].replace('(', '').replace(')', ''));
      });
    });
  }, [airport]);

  return (
    <Wrap>
      <Content>
        <Text>
          Мое гражданство: 
          <List>
            <Changable>
              <span className="placeholder">
                Россия
              </span>
            </Changable>
            <ListUl className="list__ul">
              <ListUlLi>
                <Option href="#">
                  Россия
                </Option>
              </ListUlLi>
              <ListUlLi>
                <Option href="#">
                  Казахстан
                </Option>
              </ListUlLi>
              { /* <ListUlLi><Option href="#">Украина</Option></ListUlLi>
              <ListUlLi><Option href="#">Узбекистан</Option></ListUlLi>
              <ListUlLi><Option href="#">Киргизия</Option></ListUlLi> */ }
            </ListUl>
          </List>
          <br />
          <br />
          Точка вылета/прилёта: 
          <List>
            <Changable>
              <input 
                className="placeholderAir" 
                type="text" 
                name="airport" 
                value={airport} 
                onChange={handleAirport} 
              />
            </Changable>
            <ListUl className="list__ulAir">
              { airports && airports }
            </ListUl>
          </List>
          <br />
          <br />
          <DateRange
            editableDateInputs={true}
            onChange={item => setState([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={state}
          />
        </Text>
        <Link 
          to={ 
            `/tickets/${airportShort}/${country}/${formatDate(state[0].startDate)}/${formatDate(state[0].endDate)}` 
          } 
          onClick={handleClick}
        >
          <Button>
            ПОДОБРАТЬ БИЛЕТЫ
          </Button>
        </Link>
        <ButtonBottomBorder />
      </Content>
    </Wrap>
  );
};
