import styled from 'styled-components';
import Chart from 'react-apexcharts';
import { flexContainer } from 'styles';
import { makeChart } from 'utils';
import { Header, Title, Navigation } from 'components';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Ivegi {
  id: number;
  type: string;
  name: string;
  level: number;
  alarm: string;
  attendance: Array<boolean>;
}

const StyledMain = styled.main`
  ${flexContainer({ d: 'column', w: 'nowrap', ai: 'center' })};
  position: relative;
  min-height: 100vh;
  padding: 0 var(--spacing-xxs) var(--spacing-xs);
`;

const StyledUl = styled.ul`
  ${flexContainer({ d: 'column', w: 'wrap', g: 'var(--spacing-xxs)' })}
  width: 100%;
  li {
    font-size: var(--text-sm);
    line-height: var(--text-lg);
  }
`;

const StyledDiv = styled.div`
  min-width: 100%;
  height: 18.75rem;
  .apexcharts-tooltip-series-group:last-of-type
    .apexcharts-tooltip-marker::after {
    display: block;
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #999999;
  }
`;

export default function MyPage() {
  const [nickname, setNickname] = useState('a');
  const [money, setMoney] = useState(10000);
  const [harvest, setHarvest] = useState(3);
  const [vegis, setVegis] = useState([]);
  const [chart, setChart] = useState(
    makeChart({
      categories: [],
      types: [],
      success: [],
      fail: [],
    })
  );

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const res = await axios.get(`${process.env.URL}api/users/info`, {
          withCredentials: true,
        });
        const { nickname, money, harvest, vegis } = res.data.body.data;
        const categories = vegis.map((vegi) => vegi['name']);
        const types = vegis.map((vegi) => vegi['type']);
        const success = vegis.map(
          (vegi: Ivegi) =>
            vegi['attendance']?.filter((a: boolean) => a === true).length
        );
        const fail = vegis.map(
          (vegi: Ivegi) =>
            vegi['attendance']?.filter((a: boolean) => a === false).length
        );

        setNickname(nickname);
        setMoney(money);
        setHarvest(harvest);
        setVegis(vegis);
        setChart(makeChart({ categories, types, success, fail }));
      } catch (err) {
        console.error(err);
      }
    }
    fetchUserInfo();
  }, []);

  return (
    <>
      <Header />
      <StyledMain>
        <Title>My Page</Title>
        <StyledUl>
          <li>닉네임 : {nickname}</li>
          <li>자산 : {money}원 </li>
          <li>판매 작물 : {harvest}개</li>
          <li>보유 작물 : {vegis.length}개</li>
          <li>통계: </li>
          <StyledDiv>
            <Chart
              options={chart.options}
              series={chart.series}
              width="100%"
              height="100%"
              type="bar"
            />
          </StyledDiv>
        </StyledUl>
      </StyledMain>
      <Navigation />
    </>
  );
}
