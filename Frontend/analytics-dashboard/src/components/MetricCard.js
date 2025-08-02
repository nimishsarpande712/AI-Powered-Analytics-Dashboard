import React, { useRef, useEffect } from 'react';
import {
  Box,
  Heading,
  Stat,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
} from '@chakra-ui/react';
import Tilt from 'react-parallax-tilt';
import anime from 'animejs/lib/anime.es.js';

const MetricCard = ({ title, value, percentageChange, delay = 0 }) => {
  const cardRef = useRef(null);
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (cardRef.current) {
      anime({
        targets: cardRef.current,
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1000,
        delay,
        easing: 'easeOutElastic(1, .8)',
      });
    }
  }, [delay]);

  return (
    <Tilt
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      scale={1.02}
      transitionSpeed={400}
      gyroscope={false}
    >
      <Box
        ref={cardRef}
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        p={6}
        boxShadow="lg"
        opacity="0"
        transform="translateY(50px)"
      >
        <Heading size="sm" color="gray.500" mb={2}>
          {title}
        </Heading>
        <Stat>
          <StatNumber fontSize="2xl">{value}</StatNumber>
          {percentageChange && (
            <StatHelpText>
              <StatArrow
                type={percentageChange >= 0 ? 'increase' : 'decrease'}
              />
              {Math.abs(percentageChange)}%
            </StatHelpText>
          )}
        </Stat>
      </Box>
    </Tilt>
  );
};

export default MetricCard;
